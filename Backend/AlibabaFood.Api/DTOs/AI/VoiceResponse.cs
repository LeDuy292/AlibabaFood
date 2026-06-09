namespace AlibabaFood.Api.DTOs.AI
{
    public class VoiceResponse
    {
        public string AudioBase64 { get; set; } = string.Empty;
        public string ContentType { get; set; } = "audio/mpeg";
        public int Duration { get; set; }
    }
}
