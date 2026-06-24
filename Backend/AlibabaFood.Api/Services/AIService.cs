using AlibabaFood.Api.DTOs.AI;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using AlibabaFood.Api.Data;

namespace AlibabaFood.Api.Services
{
    public class AIService : IAIService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AIService> _logger;
        private readonly HttpClient _httpClient;
        private readonly AlibabaFoodContext _context;
        private readonly string _geminiApiKey;
        private readonly string _geminiModel;
        private readonly string? _elevenLabsApiKey;
        private readonly string _defaultVoiceId;

        public AIService(IConfiguration configuration, ILogger<AIService> logger, HttpClient httpClient, AlibabaFoodContext context)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClient;
            _context = context;

            // Initialize Gemini settings from configuration
            _geminiApiKey = _configuration["AISettings:Gemini:ApiKey"] ?? string.Empty;
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

                string aiResponse;
                List<FoodRecommendation> recommendations;

                try
                {
                    // Generate AI response using Gemini
                    var prompt = await BuildFoodConsultationPromptAsync(request);
                    aiResponse = await GenerateGeminiResponseAsync(prompt, jsonMode: false);
                    recommendations = await GenerateFoodSuggestions(request);
                }
                catch (Exception aiEx)
                {
                    _logger.LogWarning(aiEx, "Gemini API call failed, falling back to local database recommendation logic");
                    var fallbackResult = await GetLocalFallbackSuggestionsAsync(request);
                    aiResponse = fallbackResult.TextResponse;
                    recommendations = fallbackResult.Recommendations;
                }

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
                    try
                    {
                        var voiceResponse = await TextToSpeechAsync(aiResponse, request.VoiceId);
                        response.VoiceBase64 = voiceResponse.AudioBase64;
                    }
                    catch (Exception ttsEx)
                    {
                        _logger.LogWarning(ttsEx, "TTS generation failed during callback, skipping audio");
                    }
                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Critical error getting food consultation");
                return new FoodConsultationResponse
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi tư vấn món ăn: " + ex.Message
                };
            }
        }

        private async Task<(string TextResponse, List<FoodRecommendation> Recommendations)> GetLocalFallbackSuggestionsAsync(FoodConsultationRequest request)
        {
            var menuItems = await GetDatabaseMenuAsync();
            string question = request.Question.ToLower().Trim();
            
            // Default response
            string text = "Xin lỗi bạn, trợ lý ảo Alibaba đang bận hoặc gặp sự cố kết nối với máy chủ AI. Dựa trên thực đơn hiện có, tôi xin đề xuất một số món ăn nổi bật sau đây phù hợp với bạn:";
            
            // Check for greeting
            var greetings = new[] { "xin chào", "hello", "hi", "chào", "chào bạn" };
            if (greetings.Any(g => question == g) || question.Length < 3)
            {
                return ("Xin chào bạn, tôi là nhân viên ảo của Alibaba Food, tôi có thể giúp gì cho bạn?", new List<FoodRecommendation>());
            }

            var matchedItems = new List<MenuEntry>();

            if (question.Contains("healthy") || question.Contains("sức khỏe") || question.Contains("chay") || question.Contains("vegan") || question.Contains("rau"))
            {
                text = "Hiện tại máy chủ AI đang tải chậm, nhưng tôi khuyên bạn nên thử các món ăn thanh đạm, lành mạnh hoặc hạt dinh dưỡng sau đây:";
                matchedItems = menuItems.Where(m => m.Category.Contains("Chay", StringComparison.OrdinalIgnoreCase) 
                                               || m.Category.Contains("Healthy", StringComparison.OrdinalIgnoreCase)
                                               || m.Category.Contains("Ăn vặt", StringComparison.OrdinalIgnoreCase)
                                               || m.Name.Contains("Salad", StringComparison.OrdinalIgnoreCase)
                                               || m.Name.Contains("Nut", StringComparison.OrdinalIgnoreCase)).ToList();
            }
            else if (question.Contains("combo") || question.Contains("gia đình") || question.Contains("nhiều") || question.Contains("nhóm"))
            {
                text = "Dưới đây là các gói combo tiết kiệm và nhiều món của chúng tôi, cực kỳ phù hợp cho nhóm hoặc gia đình:";
                matchedItems = menuItems.Where(m => m.Category.Contains("Combo", StringComparison.OrdinalIgnoreCase)).ToList();
            }
            else if (question.Contains("burger") || question.Contains("bánh mì") || question.Contains("nhanh"))
            {
                text = "Nếu bạn muốn ăn nhanh gọn, hãy thử các dòng bánh mì và burger thơm ngon nóng hổi này:";
                matchedItems = menuItems.Where(m => m.Category.Contains("Burger", StringComparison.OrdinalIgnoreCase) 
                                               || m.Name.Contains("Burger", StringComparison.OrdinalIgnoreCase)
                                               || m.Name.Contains("Bánh mì", StringComparison.OrdinalIgnoreCase)).ToList();
            }
            else if (question.Contains("gà") || question.Contains("chicken"))
            {
                text = "Đây là các món gà rán giòn rụm thơm ngon được yêu thích tại cửa hàng:";
                matchedItems = menuItems.Where(m => m.Category.Contains("Gà", StringComparison.OrdinalIgnoreCase) 
                                               || m.Name.Contains("Gà", StringComparison.OrdinalIgnoreCase)
                                               || m.Name.Contains("Chicken", StringComparison.OrdinalIgnoreCase)).ToList();
            }
            else if (question.Contains("bánh") || question.Contains("ngọt") || question.Contains("tráng miệng"))
            {
                text = "Để tráng miệng hoặc ăn nhẹ ngọt ngào, đây là danh sách bánh ngọt hấp dẫn dành cho bạn:";
                matchedItems = menuItems.Where(m => m.Category.Contains("Bánh", StringComparison.OrdinalIgnoreCase) 
                                               || m.Name.Contains("Cake", StringComparison.OrdinalIgnoreCase)).ToList();
            }

            // Fallback: If no match or match is empty, take first 3 items
            if (matchedItems.Count == 0)
            {
                matchedItems = menuItems.Take(3).ToList();
            }
            else
            {
                matchedItems = matchedItems.Take(3).ToList();
            }

            var recommendations = matchedItems.Select(m => new FoodRecommendation
            {
                Name = m.Name,
                Description = m.Description,
                Category = m.Category,
                PriceRange = $"{m.Price:N0}đ",
                Ingredients = new List<string> { "Thành phần tự nhiên", "Đảm bảo vệ sinh an toàn thực phẩm" },
                Benefits = new List<string> { "Hương vị thơm ngon", "Dinh dưỡng cân bằng" },
                PreparationTime = "10-15 phút",
                MatchScore = 95,
                ImageUrl = m.ImageUrl,
                OrderLink = $"/food-detail?id={m.Id}"
            }).ToList();

            return (text, recommendations);
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

        private async Task<List<MenuEntry>> GetDatabaseMenuAsync()
        {
            try
            {
                var items = await _context.FoodItems
                    .AsNoTracking()
                    .Include(f => f.Images)
                    .Include(f => f.Category)
                    .Where(f => f.IsActive && f.QuantityAvailable > 0)
                    .Select(f => new MenuEntry
                    {
                        Id = f.ItemId,
                        Name = f.ItemName,
                        Category = f.Category.CategoryName,
                        Price = (double)f.DiscountedPrice,
                        Description = f.Description ?? string.Empty,
                        ImageUrl = f.Images.OrderByDescending(img => img.IsPrimary).Select(img => img.ImageUrl).FirstOrDefault() 
                                   ?? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                    })
                    .Take(25)
                    .ToListAsync();

                if (items.Count == 0)
                {
                    return GetOfficialMenu();
                }
                return items;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching food items from database, falling back to static menu");
                return GetOfficialMenu();
            }
        }

        private async Task<string> BuildFoodConsultationPromptAsync(FoodConsultationRequest request)
        {
            var menuItems = await GetDatabaseMenuAsync();
            var menuListStr = string.Join(", ", menuItems.Select(m => m.Name));

            var prompt = $"""
                Bạn là Nhân viên ảo của Alibaba Food.
                QUY TẮC CỐ ĐỊNH:
                1. Nếu khách chào (ví dụ: "xin chào", "hi", "hello"), bạn PHẢI trả lời chính xác là: "Xin chào bạn, tôi là nhân viên ảo của Alibaba Food, tôi có thể giúp gì cho bạn?"
                2. Khách hỏi gì thì trả lời nấy, NGẮN GỌN và ĐÚNG TRỌNG TÂM.
                3. Chỉ trả lời các nội dung liên quan đến ẩm thực, món ăn, dinh dưỡng hoặc về website Alibaba Food.
                4. Nếu câu hỏi KHÔNG liên quan đến website hoặc ẩm thực, bạn PHẢI từ chối trả lời một cách lịch sự nhưng dứt khoát.
                5. Chỉ gợi ý và trả lời bằng các món ăn thực tế có sẵn trong thực đơn sau đây: [{menuListStr}].

                Câu hỏi của khách: {request.Question}

                Thông tin bổ sung của khách hàng:
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
                if (string.IsNullOrWhiteSpace(_geminiApiKey) || _geminiApiKey == "YOUR_GEMINI_API_KEY_HERE")
                {
                    _logger.LogError("Gemini API Key is not configured correctly in appsettings.json or appsettings.Development.json.");
                    throw new InvalidOperationException("Gemini API Key is not configured.");
                }

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

                // Get database active menu items
                var menuItems = await GetDatabaseMenuAsync();
                var menuListStr = string.Join("\n", menuItems.Select(m => $"- {m.Name} (Danh mục: {m.Category}, Giá: {m.Price:N0}đ, Mô tả: {m.Description})"));

                var prompt = $@"Dựa trên yêu cầu và câu hỏi của khách hàng: ""{request.Question}"", hãy gợi ý chính xác tối đa 3 món ăn phù hợp nhất từ thực đơn của Alibaba Food bên dưới.
                    
                    DANH SÁCH THỰC ĐƠN ĐANG CÓ:
                    {menuListStr}

                    QUY TẮC:
                    1. CHỈ được chọn món ăn nằm trong danh sách thực đơn đang có ở trên. Không tự ý bịa ra món ăn mới.
                    2. Trả về DUY NHẤT dữ liệu JSON khớp với schema bên dưới, không kèm bất kỳ giải thích nào.
                    
                    Định dạng JSON yêu cầu:
                    {{
                        ""suggestions"": [
                            {{
                                ""name"": ""Tên món khớp chính xác 100%"",
                                ""description"": ""Mô tả tại sao món này phù hợp với yêu cầu của khách"",
                                ""category"": ""Danh mục món ăn"",
                                ""priceRange"": ""Ví dụ: 45.000đ"",
                                ""ingredients"": [""thành phần chính""],
                                ""benefits"": [""lợi ích sức khỏe hoặc dinh dưỡng""],
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
                        var matchingItem = menuItems.FirstOrDefault(m => m.Name.Equals(suggestion.Name, StringComparison.OrdinalIgnoreCase)
                                            || m.Name.Contains(suggestion.Name, StringComparison.OrdinalIgnoreCase)
                                            || suggestion.Name.Contains(m.Name, StringComparison.OrdinalIgnoreCase));
                        
                        if (matchingItem != null)
                        {
                            suggestions.Add(new FoodRecommendation
                            {
                                Name = matchingItem.Name,
                                Description = suggestion.Description,
                                Category = matchingItem.Category,
                                PriceRange = $"{matchingItem.Price:N0}đ",
                                Ingredients = suggestion.Ingredients,
                                Benefits = suggestion.Benefits,
                                PreparationTime = suggestion.PreparationTime,
                                MatchScore = suggestion.MatchScore,
                                ImageUrl = matchingItem.ImageUrl,
                                OrderLink = $"/food-detail?id={matchingItem.Id}"
                            });
                        }
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

        private int EstimateAudioDuration(string text)
        {
            var wordCount = text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
            return (int)Math.Ceiling(wordCount / 150.0 * 60); 
        }

        private List<MenuEntry> GetOfficialMenu()
        {
            return new List<MenuEntry>
            {
                new MenuEntry { Id = 1, Name = "Classic Burger", ImageUrl = "https://png.pngtree.com/png-vector/20230321/ourmid/pngtree-beef-burger-food-png-image_6655517.png", Category = "Burger", Price = 45000, Description = "Hamburger bò truyền thống kèm phô mai" },
                new MenuEntry { Id = 2, Name = "Crispy Chicken", ImageUrl = "https://png.pngtree.com/png-clipart/20220924/ourmid/pngtree-crispy-fried-chicken-food-png-image_6222027.png", Category = "Gà rán", Price = 35000, Description = "Gà rán giòn rụm cay nhẹ" },
                new MenuEntry { Id = 3, Name = "Burger Combo", ImageUrl = "https://png.pngtree.com/png-clipart/20221001/ourmid/pngtree-fast-food-big-ham-burger-png-image_6244235.png", Category = "Combo", Price = 75000, Description = "Combo burger bò kèm khoai tây chiên và nước ngọt" },
                new MenuEntry { Id = 4, Name = "Family Combo", ImageUrl = "https://png.pngtree.com/png-clipart/20221006/ourmid/pngtree-food-combo-fast-food-png-image_6270777.png", Category = "Combo", Price = 150000, Description = "Combo gia đình siêu to khổng lồ" },
                new MenuEntry { Id = 5, Name = "Black Forest Cake", ImageUrl = "https://png.pngtree.com/png-clipart/20240406/ourmid/pngtree-detailed-black-forest-cake-png-image_12235948.png", Category = "Bánh ngọt", Price = 60000, Description = "Bánh gato sô cô la rừng đen ngọt ngào" },
                new MenuEntry { Id = 6, Name = "Strawberry Cake", ImageUrl = "https://png.pngtree.com/png-vector/20221103/ourmid/pngtree-birthday-strawberry-birthday-cake-png-image_6404248.png", Category = "Bánh ngọt", Price = 55000, Description = "Bánh sinh nhật kem dâu tây tươi" },
                new MenuEntry { Id = 7, Name = "Beef Jerky", ImageUrl = "https://png.pngtree.com/png-clipart/20230922/ourmid/pngtree-premium-fresh-beef-jerky-with-spices-snack-png-image_10143891.png", Category = "Ăn vặt", Price = 90000, Description = "Thịt bò khô cay xé sợi thơm ngon" },
                new MenuEntry { Id = 8, Name = "Mixed Nuts", ImageUrl = "https://png.pngtree.com/png-vector/20231030/ourmid/pngtree-mixed-nuts-png-image_10291097.png", Category = "Ăn vặt", Price = 50000, Description = "Hạt tổng hợp dinh dưỡng" }
            };
        }

        private class MenuEntry
        {
            public int Id { get; set; }
            public string Name { get; set; } = "";
            public string ImageUrl { get; set; } = "";
            public string Category { get; set; } = "";
            public double Price { get; set; }
            public string Description { get; set; } = "";
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
