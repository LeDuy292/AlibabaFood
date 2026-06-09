namespace AlibabaFood.Api.DTOs.Payment
{
    public class CreateOrderResponseDto
    {
        public int OrderId { get; set; }
        public long OrderCode { get; set; }
        public string CheckoutUrl { get; set; } = string.Empty;
        public string PaymentLinkId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int Amount { get; set; }
    }

    public class OrderDetailsDto
    {
        public int OrderId { get; set; }
        public long OrderCode { get; set; }
        public string Status { get; set; } = string.Empty;
        public int TotalAmount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string BuyerName { get; set; } = string.Empty;
        public string? BuyerEmail { get; set; }
        public string? BuyerPhone { get; set; }
        public string? BuyerAddress { get; set; }
        public string? CheckoutUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDetailsDto> Items { get; set; } = new();
    }

    public class OrderItemDetailsDto
    {
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int Price { get; set; }
    }
}
