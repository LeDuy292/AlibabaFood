using AlibabaFood.Api.DTOs.AI;

namespace AlibabaFood.Api.Services
{
    public interface IAIService
    {
        Task<FoodConsultationResponse> GetFoodConsultationAsync(FoodConsultationRequest request);
        Task<VoiceResponse> TextToSpeechAsync(string text, string? voiceId = null);
        Task<string> GenerateFoodRecommendationsAsync(string question, string? preferences = null, string? allergies = null);
    }
}
