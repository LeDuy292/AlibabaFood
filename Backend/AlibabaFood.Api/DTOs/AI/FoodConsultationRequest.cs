namespace AlibabaFood.Api.DTOs.AI
{
    public class FoodConsultationRequest
    {
        public string Question { get; set; } = string.Empty;
        public string? DietaryPreferences { get; set; }
        public string? Allergies { get; set; }
        public string? Budget { get; set; }
        public string? MealType { get; set; }
        public string? CuisinePreference { get; set; }
        public bool IncludeVoiceResponse { get; set; } = false;
        public string? VoiceId { get; set; }
    }
}
