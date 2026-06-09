namespace AlibabaFood.Api.DTOs.AI
{
    public class FoodConsultationResponse
    {
        public string TextResponse { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public List<FoodRecommendation> Recommendations { get; set; } = new();
        public List<FoodRecommendation> FoodSuggestions { get; set; } = new();
        public string? VoiceBase64 { get; set; }
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
