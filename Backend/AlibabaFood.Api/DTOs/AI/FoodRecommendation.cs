namespace AlibabaFood.Api.DTOs.AI
{
    public class FoodRecommendation
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? PriceRange { get; set; }
        public List<string> Ingredients { get; set; } = new();
        public List<string> Benefits { get; set; } = new();
        public string? PreparationTime { get; set; }
        public string? ImageUrl { get; set; }
        public string? OrderLink { get; set; }
        public int MatchScore { get; set; }
    }
}
