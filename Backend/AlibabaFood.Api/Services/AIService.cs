using OpenAI;
using OpenAI.Chat;
using System.ClientModel;
using AlibabaFood.Api.DTOs.AI;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace AlibabaFood.Api.Services
{
    public class AIService : IAIService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AIService> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _groqApiKey;
        private readonly string _groqModel;
        private readonly string _elevenLabsApiKey;
        private readonly string _defaultVoiceId;

        public AIService(IConfiguration configuration, ILogger<AIService> logger, HttpClient httpClient)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClient;

            // Initialize Groq settings
            _groqApiKey = _configuration["AISettings:Groq:ApiKey"] 
                ?? throw new InvalidOperationException("Groq API key not configured");
            _groqModel = _configuration["AISettings:Groq:Model"] ?? "llama-3.3-70b-versatile";

            // Initialize ElevenLabs
            _elevenLabsApiKey = _configuration["AISettings:ElevenLabs:ApiKey"] 
                ?? throw new InvalidOperationException("ElevenLabs API key not configured");
            _defaultVoiceId = _configuration["AISettings:ElevenLabs:VoiceId"] ?? "21m00Tcm4TlvDq8ikWAM";
        }

        public async Task<FoodConsultationResponse> GetFoodConsultationAsync(FoodConsultationRequest request)
        {
            try
            {
                _logger.LogInformation("Getting food consultation via Groq for question: {Question}", request.Question);

                // Generate AI response using Groq
                var prompt = BuildFoodConsultationPrompt(request);
                var aiResponse = await GenerateGroqResponseAsync(prompt);

                // Parse recommendations from AI response
                var recommendations = await GenerateFoodSuggestions(request);

                var response = new FoodConsultationResponse
                {
                    TextResponse = aiResponse,
                    Recommendations = recommendations,
                    FoodSuggestions = recommendations,
                    Success = true,
                    Message = "Tư vấn thành công"
                };

                // Generate voice response if requested
                if (request.IncludeVoiceResponse)
                {
                    var voiceResponse = await TextToSpeechAsync(aiResponse, request.VoiceId);
                    response.VoiceBase64 = voiceResponse.AudioBase64;
                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting food consultation via Groq");
                return new FoodConsultationResponse
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi tư vấn món ăn: " + ex.Message
                };
            }
        }

        public async Task<VoiceResponse> TextToSpeechAsync(string text, string? voiceId = null)
        {
            try
            {
                _logger.LogInformation("Converting text to speech: {TextLength} characters", text.Length);

                voiceId ??= _defaultVoiceId;

                var requestUrl = $"https://api.elevenlabs.io/v1/text-to-speech/{voiceId}";
                var requestBody = new
                {
                    text = text,
                    model_id = "eleven_multilingual_v2",
                    voice_settings = new
                    {
                        stability = 0.5,
                        similarity_boost = 0.75
                    }
                };

                var requestMessage = new HttpRequestMessage(HttpMethod.Post, requestUrl)
                {
                    Content = JsonContent.Create(requestBody)
                };
                requestMessage.Headers.Add("xi-api-key", _elevenLabsApiKey);

                var response = await _httpClient.SendAsync(requestMessage);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("ElevenLabs API error: {StatusCode} - {Error}", response.StatusCode, errorContent);
                    throw new InvalidOperationException($"ElevenLabs API error: {response.StatusCode}");
                }

                var audioBytes = await response.Content.ReadAsByteArrayAsync();

                return new VoiceResponse
                {
                    AudioBase64 = Convert.ToBase64String(audioBytes),
                    ContentType = "audio/mpeg",
                    Duration = EstimateAudioDuration(text)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error converting text to speech");
                throw new InvalidOperationException("Không thể tạo giọng nói: " + ex.Message);
            }
        }

        public async Task<string> GenerateFoodRecommendationsAsync(string question, string? preferences = null, string? allergies = null)
        {
            try
            {
                var prompt = $"""
                Bạn là một chuyên gia ẩm thực Việt Nam. Hãy tư vấn cho khách hàng về món ăn phù hợp.

                Câu hỏi của khách: {question}

                {(!string.IsNullOrEmpty(preferences) ? $"Sở thích ăn uống: {preferences}" : "")}
                {(!string.IsNullOrEmpty(allergies) ? $"Dị ứng: {allergies}" : "")}

                Hãy trả lời một cách thân thiện, chuyên nghiệp và đưa ra gợi ý cụ thể.
                """;

                return await GenerateGroqResponseAsync(prompt);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating food recommendations via Groq");
                throw new InvalidOperationException("Không thể tạo gợi ý món ăn: " + ex.Message);
            }
        }

        private string BuildFoodConsultationPrompt(FoodConsultationRequest request)
        {
            var prompt = $"""
                Bạn là Nhân viên ảo của Alibaba Food.
                QUY TẮC CỐ ĐỊNH:
                1. Nếu khách chào (ví dụ: "xin chào", "hi", "hello"), bạn PHẢI trả lời chính xác là: "Xin chào bạn, tôi là nhân viên ảo của Alibaba Food, tôi có thể giúp gì cho bạn?"
                2. Khách hỏi gì thì trả lời nấy, NGẮN GỌN và ĐÚNG TRỌNG TÂM.
                3. Chỉ trả lời các nội dung liên quan đến ẩm thực, món ăn, dinh dưỡng hoặc về website Alibaba Food.
                4. Nếu câu hỏi KHÔNG liên quan đến website hoặc ẩm thực, bạn PHẢI từ chối trả lời một cách lịch sự nhưng dứt khoát.

                Câu hỏi của khách: {request.Question}

                Thông tin bổ sung:
                """;

            if (!string.IsNullOrEmpty(request.DietaryPreferences))
                prompt += $"\n- Sở thích: {request.DietaryPreferences}";

            if (!string.IsNullOrEmpty(request.Allergies))
                prompt += $"\n- Dị ứng: {request.Allergies}";

            if (!string.IsNullOrEmpty(request.Budget))
                prompt += $"\n- Ngân sách: {request.Budget}";

            if (!string.IsNullOrEmpty(request.MealType))
                prompt += $"\n- Bữa ăn: {request.MealType}";

            return prompt;
        }

        private async Task<string> GenerateGroqResponseAsync(string prompt)
        {
            try
            {
                var requestUrl = "https://api.groq.com/openai/v1/chat/completions";
                var requestBody = new
                {
                    model = _groqModel,
                    messages = new[]
                    {
                        new { role = "system", content = "Bạn là Nhân viên ảo của Alibaba Food. Bạn trả lời khách hàng cực kỳ ngắn gọn, đúng trọng tâm. Nếu câu hỏi không liên quan đến ẩm thực hoặc website Alibaba Food, hãy từ chối trả lời. Nếu khách chào, hãy trả lời theo mẫu: 'Xin chào bạn, tôi là nhân viên ảo của Alibaba Food, tôi có thể giúp gì cho bạn?'" },
                        new { role = "user", content = prompt }
                    },
                    temperature = 0.3, // Lower temperature for more consistency
                    max_tokens = 300
                };

                var requestMessage = new HttpRequestMessage(HttpMethod.Post, requestUrl)
                {
                    Content = JsonContent.Create(requestBody)
                };
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _groqApiKey);

                var response = await _httpClient.SendAsync(requestMessage);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Groq API error: {StatusCode} - {Error}", response.StatusCode, errorContent);
                    throw new InvalidOperationException($"Groq API error: {response.StatusCode}");
                }

                var jsonResult = await response.Content.ReadFromJsonAsync<JsonElement>();
                return jsonResult.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Groq response");
                throw new InvalidOperationException("Không thể tạo phản hồi AI: " + ex.Message);
            }
        }

        private async Task<List<FoodRecommendation>> GenerateFoodSuggestions(FoodConsultationRequest request)
        {
            try
            {
                // Improved greeting check: only skip if it's ONLY a greeting
                string q = request.Question.ToLower().Trim();
                var greetings = new[] { "xin chào", "hello", "hi", "chào", "chào bạn" };
                if (greetings.Any(g => q == g) || q.Length < 3) 
                {
                    return new List<FoodRecommendation>();
                }

                var prompt = $@"Dựa trên yêu cầu ""{request.Question}"", hãy gợi ý chính xác 3 món ăn từ thực đơn Alibaba Food bên dưới.
                    QUY TẮC: 
                    1. CHỈ được chọn từ danh sách: [Classic Burger, Crispy Chicken, Burger Combo, Family Combo, Black Forest Cake, Strawberry Cake, Beef Jerky, Mixed Nuts].
                    2. Trả về DUY NHẤT dữ liệu JSON, không kèm lời giải thích hay chữ nào khác.
                    
                    Định dạng JSON:
                    {{
                        ""suggestions"": [
                            {{
                                ""name"": ""Tên món khớp 100% danh sách trên"",
                                ""description"": ""Mô tả tại sao món này hợp"",
                                ""category"": ""Phân loại"",
                                ""priceRange"": ""Giá niêm yết"",
                                ""ingredients"": [""thành phần""],
                                ""benefits"": [""lợi ích""],
                                ""preparationTime"": ""15-20 min"",
                                ""matchScore"": 95
                            }}
                        ]
                    }}";

                var response = await GenerateGroqResponseAsync(prompt);
                
                // Robust JSON extraction using Regex
                var jsonMatch = Regex.Match(response, @"\{.*\}", RegexOptions.Singleline);
                if (!jsonMatch.Success)
                {
                    Console.WriteLine("AI Response did not contain valid JSON structure.");
                    Console.WriteLine("Raw Response: " + response);
                    return new List<FoodRecommendation>();
                }

                string jsonContent = jsonMatch.Value;
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var suggestionsContainer = JsonSerializer.Deserialize<SuggestionsContainer>(jsonContent, options);
                
                if (suggestionsContainer?.Suggestions != null)
                {
                    var suggestions = new List<FoodRecommendation>();
                    foreach (var suggestion in suggestionsContainer.Suggestions)
                    {
                        suggestions.Add(new FoodRecommendation
                        {
                            Name = suggestion.Name,
                            Description = suggestion.Description,
                            Category = suggestion.Category,
                            PriceRange = suggestion.PriceRange,
                            Ingredients = suggestion.Ingredients,
                            Benefits = suggestion.Benefits,
                            PreparationTime = suggestion.PreparationTime,
                            MatchScore = suggestion.MatchScore,
                            ImageUrl = MapImageUrl(suggestion.Name),
                            OrderLink = MapOrderLink(suggestion.Name)
                        });
                    }
                    return suggestions;
                }

                return new List<FoodRecommendation>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GenerateFoodSuggestions: {ex.Message}");
                _logger.LogError(ex, "Error generating food suggestions via Groq");
                return new List<FoodRecommendation>();
            }
        }

        private List<string> ParseStringArray(JsonElement element, string propertyName)
        {
            var result = new List<string>();
            if (element.TryGetProperty(propertyName, out var arrayElement))
            {
                foreach (var item in arrayElement.EnumerateArray())
                {
                    result.Add(item.GetString() ?? "");
                }
            }
            return result;
        }

        private int EstimateAudioDuration(string text)
        {
            var wordCount = text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
            return (int)Math.Ceiling(wordCount / 150.0 * 60); 
        }

        private string MapImageUrl(string name)
        {
            var menu = GetOfficialMenu();
            var item = menu.FirstOrDefault(m => name.Contains(m.Name, StringComparison.OrdinalIgnoreCase) || m.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
            return item?.ImageUrl ?? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
        }

        private string MapOrderLink(string name)
        {
            var menu = GetOfficialMenu();
            var item = menu.FirstOrDefault(m => name.Contains(m.Name, StringComparison.OrdinalIgnoreCase) || m.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
            return item != null ? $"/menu#item-{item.Id}" : "/menu";
        }

        private List<MenuEntry> GetOfficialMenu()
        {
            return new List<MenuEntry>
            {
                new MenuEntry { Id = 1, Name = "Classic Burger", ImageUrl = "https://png.pngtree.com/png-vector/20230321/ourmid/pngtree-beef-burger-food-png-image_6655517.png" },
                new MenuEntry { Id = 2, Name = "Crispy Chicken", ImageUrl = "https://png.pngtree.com/png-clipart/20220924/ourmid/pngtree-crispy-fried-chicken-food-png-image_6222027.png" },
                new MenuEntry { Id = 3, Name = "Burger Combo", ImageUrl = "https://png.pngtree.com/png-clipart/20221001/ourmid/pngtree-fast-food-big-ham-burger-png-image_6244235.png" },
                new MenuEntry { Id = 4, Name = "Family Combo", ImageUrl = "https://png.pngtree.com/png-clipart/20221006/ourmid/pngtree-food-combo-fast-food-png-image_6270777.png" },
                new MenuEntry { Id = 5, Name = "Black Forest Cake", ImageUrl = "https://png.pngtree.com/png-clipart/20240406/ourmid/pngtree-detailed-black-forest-cake-png-image_12235948.png" },
                new MenuEntry { Id = 6, Name = "Strawberry Cake", ImageUrl = "https://png.pngtree.com/png-vector/20221103/ourmid/pngtree-birthday-strawberry-birthday-cake-png-image_6404248.png" },
                new MenuEntry { Id = 7, Name = "Beef Jerky", ImageUrl = "https://png.pngtree.com/png-clipart/20230922/ourmid/pngtree-premium-fresh-beef-jerky-with-spices-snack-png-image_10143891.png" },
                new MenuEntry { Id = 8, Name = "Mixed Nuts", ImageUrl = "https://png.pngtree.com/png-vector/20231030/ourmid/pngtree-mixed-nuts-png-image_10291097.png" }
            };
        }

        private class MenuEntry
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public string ImageUrl { get; set; } = "";
        }

        private class SuggestionsContainer
        {
            [JsonPropertyName("suggestions")]
            public List<FoodSuggestionInternal>? Suggestions { get; set; }
        }

        private class FoodSuggestionInternal
        {
            [JsonPropertyName("name")]
            public string Name { get; set; } = "";
            [JsonPropertyName("description")]
            public string Description { get; set; } = "";
            [JsonPropertyName("category")]
            public string Category { get; set; } = "";
            [JsonPropertyName("priceRange")]
            public string PriceRange { get; set; } = "";
            [JsonPropertyName("ingredients")]
            public List<string> Ingredients { get; set; } = new();
            [JsonPropertyName("benefits")]
            public List<string> Benefits { get; set; } = new();
            [JsonPropertyName("preparationTime")]
            public string PreparationTime { get; set; } = "";
            [JsonPropertyName("matchScore")]
            public int MatchScore { get; set; }
        }
    }
}
