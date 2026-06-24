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
        private readonly string _geminiApiKey;
        private readonly string _geminiModel;
        private readonly string? _elevenLabsApiKey;
        private readonly string _defaultVoiceId;

        public AIService(IConfiguration configuration, ILogger<AIService> logger, HttpClient httpClient)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClient;

            // Initialize Gemini settings with a resilient fallback to the provided key
            _geminiApiKey = _configuration["AISettings:Gemini:ApiKey"] ?? "";
            _geminiModel = _configuration["AISettings:Gemini:Model"] ?? "gemini-2.5-flash";

            // Initialize ElevenLabs (resilient, no throwing exceptions if missing)
            _elevenLabsApiKey = _configuration["AISettings:ElevenLabs:ApiKey"];
            _defaultVoiceId = _configuration["AISettings:ElevenLabs:VoiceId"] ?? "21m00Tcm4TlvDq8ikWAM";
        }

        public async Task<FoodConsultationResponse> GetFoodConsultationAsync(FoodConsultationRequest request)
        {
            try
            {
                _logger.LogInformation("Getting food consultation via Gemini for question: {Question}", request.Question);

                // Generate AI response using Gemini
                var prompt = BuildFoodConsultationPrompt(request);
                var aiResponse = await GenerateGeminiResponseAsync(prompt, jsonMode: false);

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

                // Generate voice response if requested and ElevenLabs key is present
                if (request.IncludeVoiceResponse && !string.IsNullOrEmpty(_elevenLabsApiKey))
                {
                    var voiceResponse = await TextToSpeechAsync(aiResponse, request.VoiceId);
                    response.VoiceBase64 = voiceResponse.AudioBase64;
                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting food consultation via Gemini");
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
                if (string.IsNullOrEmpty(_elevenLabsApiKey))
                {
                    _logger.LogWarning("ElevenLabs API key is not configured. Skipping Text-to-Speech.");
                    return new VoiceResponse
                    {
                        AudioBase64 = string.Empty,
                        ContentType = "audio/mpeg",
                        Duration = 0
                    };
                }

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
                    return new VoiceResponse { AudioBase64 = string.Empty, ContentType = "audio/mpeg", Duration = 0 };
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
                _logger.LogWarning(ex, "Error converting text to speech, falling back gracefully");
                return new VoiceResponse
                {
                    AudioBase64 = string.Empty,
                    ContentType = "audio/mpeg",
                    Duration = 0
                };
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

                return await GenerateGeminiResponseAsync(prompt, jsonMode: false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating food recommendations via Gemini");
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

        private async Task<string> GenerateGeminiResponseAsync(string prompt, bool jsonMode = false)
        {
            try
            {
                var requestUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{_geminiModel}:generateContent?key={_geminiApiKey}";
                
                object generationConfig = jsonMode 
                    ? new { temperature = 0.1, responseMimeType = "application/json" }
                    : new { temperature = 0.3, maxOutputTokens = 800 };

                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    },
                    systemInstruction = new
                    {
                        parts = new[]
                        {
                            new { text = "Bạn là Nhân viên ảo của Alibaba Food. Bạn trả lời khách hàng cực kỳ ngắn gọn, đúng trọng tâm. Nếu câu hỏi không liên quan đến ẩm thực hoặc website Alibaba Food, hãy từ chối trả lời. Nếu khách chào (ví dụ: 'xin chào', 'hello', 'hi'), bạn PHẢI trả lời chính xác là: 'Xin chào bạn, tôi là nhân viên ảo của Alibaba Food, tôi có thể giúp gì cho bạn?'" }
                        }
                    },
                    generationConfig = generationConfig
                };

                var requestMessage = new HttpRequestMessage(HttpMethod.Post, requestUrl)
                {
                    Content = JsonContent.Create(requestBody)
                };

                var response = await _httpClient.SendAsync(requestMessage);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Gemini API error: {StatusCode} - {Error}", response.StatusCode, errorContent);
                    throw new InvalidOperationException($"Gemini API error: {response.StatusCode}");
                }

                var jsonResult = await response.Content.ReadFromJsonAsync<JsonElement>();
                
                if (jsonResult.TryGetProperty("candidates", out var candidates) && 
                    candidates.GetArrayLength() > 0 &&
                    candidates[0].TryGetProperty("content", out var content) &&
                    content.TryGetProperty("parts", out var parts) &&
                    parts.GetArrayLength() > 0 &&
                    parts[0].TryGetProperty("text", out var text))
                {
                    return text.GetString() ?? "";
                }

                return "";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating Gemini response");
                throw new InvalidOperationException("Không thể tạo phản hồi AI: " + ex.Message);
            }
        }

        private async Task<List<FoodRecommendation>> GenerateFoodSuggestions(FoodConsultationRequest request)
        {
            try
            {
                string q = request.Question.ToLower().Trim();
                var greetings = new[] { "xin chào", "hello", "hi", "chào", "chào bạn" };
                if (greetings.Any(g => q == g) || q.Length < 3) 
                {
                    return new List<FoodRecommendation>();
                }

                var prompt = $@"Dựa trên yêu cầu ""{request.Question}"", hãy gợi ý chính xác 3 món ăn phù hợp nhất từ thực đơn Alibaba Food bên dưới.
                    QUY TẮC: 
                    1. CHỈ được chọn từ danh sách này: [Classic Burger, Crispy Chicken, Burger Combo, Family Combo, Black Forest Cake, Strawberry Cake, Beef Jerky, Mixed Nuts].
                    2. Trả về DUY NHẤT dữ liệu JSON khớp với schema bên dưới, không kèm bất kỳ giải thích nào.
                    
                    Định dạng JSON yêu cầu:
                    {{
                        ""suggestions"": [
                            {{
                                ""name"": ""Tên món khớp 100% danh sách trên"",
                                ""description"": ""Mô tả lý do món này phù hợp"",
                                ""category"": ""Phân loại"",
                                ""priceRange"": ""Giá niêm yết"",
                                ""ingredients"": [""thành phần""],
                                ""benefits"": [""lợi ích""],
                                ""preparationTime"": ""15-20 phút"",
                                ""matchScore"": 95
                            }}
                        ]
                    }}";

                var response = await GenerateGeminiResponseAsync(prompt, jsonMode: true);
                
                var jsonMatch = Regex.Match(response, @"\{.*\}", RegexOptions.Singleline);
                if (!jsonMatch.Success)
                {
                    _logger.LogWarning("Gemini response did not contain valid JSON: {Response}", response);
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
                _logger.LogError(ex, "Error generating food suggestions via Gemini");
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
