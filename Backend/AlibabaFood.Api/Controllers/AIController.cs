using Microsoft.AspNetCore.Mvc;
using AlibabaFood.Api.DTOs.AI;
using AlibabaFood.Api.Services;

namespace AlibabaFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aiService;
        private readonly ILogger<AIController> _logger;

        public AIController(IAIService aiService, ILogger<AIController> logger)
        {
            _aiService = aiService;
            _logger = logger;
        }

        [HttpPost("consult")]
        public async Task<IActionResult> GetConsultation([FromBody] FoodConsultationRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Question))
                {
                    return BadRequest(new { success = false, message = "Câu hỏi không được để trống" });
                }

                var result = await _aiService.GetFoodConsultationAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AI consultation controller");
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi hệ thống" });
            }
        }

        [HttpPost("tts")]
        public async Task<IActionResult> TextToSpeech([FromBody] TtsRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Text))
                {
                    return BadRequest(new { success = false, message = "Nội dung không được để trống" });
                }

                var result = await _aiService.TextToSpeechAsync(request.Text, request.VoiceId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TTS controller");
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi tạo giọng nói" });
            }
        }
    }

    public class TtsRequest
    {
        public string Text { get; set; } = string.Empty;
        public string? VoiceId { get; set; }
    }
}
