import React, { useEffect, useState } from "react";
import "./HotDealSection.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getNearbyProducts } from "../services/productService";

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount) + "đ";

const filters = [
  "Tất cả",
  "Best Seller",
  "Giá Tốt Nhất",
  "Deal Sốc Cận Giờ",
];

const CARDS_PER_VIEW = 3;

const StarRating = ({ count }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={i <= Math.round(count) ? "#f59e0b" : "#d1d5db"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ))}
  </div>
);

const HotDealSection = ({ userLocation, onChangeLocation }) => {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [startIdx, setStartIdx] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lng) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch trong bán kính 10km, lấy nhiều hơn để có đủ data lọc
        const result = await getNearbyProducts(
          userLocation.lat,
          userLocation.lng,
          5
        );
        setProducts(result?.data || []);
        setStartIdx(0);
      } catch (err) {
        console.error("Lỗi tải ưu đãi:", err);
        setError("Không thể tải ưu đãi. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userLocation]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.itemId,
      name: product.itemName,
      price: product.discountedPrice,
      quantity: 1,
      image: product.imageUrl,
    });
    toast.success(`Đã thêm "${product.itemName}" vào giỏ!`);
  };

  const handleBuyNow = (product) => {
    addToCart({
      id: product.itemId,
      name: product.itemName,
      price: product.discountedPrice,
      quantity: 1,
      image: product.imageUrl,
    });
    navigate("/checkout");
  };

  // Lọc sản phẩm theo filter đang chọn
  const getFiltered = () => {
    if (activeFilter === "Tất cả") return products;
    if (activeFilter === "Best Seller")
      return products.filter((p) => p.supplierRating >= 4.5);
    if (activeFilter === "Giá Tốt Nhất")
      return [...products].sort(
        (a, b) => a.discountedPrice - b.discountedPrice
      );
    if (activeFilter === "Deal Sốc Cận Giờ")
      return products.filter((p) => p.discountPercentage >= 20);
    return products;
  };

  const filtered = getFiltered();
  const visible = filtered.slice(startIdx, startIdx + CARDS_PER_VIEW);
  const canPrev = startIdx > 0;
  const canNext = startIdx < filtered.length - CARDS_PER_VIEW;

  const handlePrev = () => setStartIdx((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setStartIdx((i) => Math.min(filtered.length - CARDS_PER_VIEW, i + 1));

  if (!userLocation) return null;

  return (
    <section className="hot-deal-section">
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 className="hot-deal-title" style={{ marginBottom: "10px" }}>
            🔥 ƯU ĐÃI CỰC KHỦNG GẦN BẠN
          </h2>
          {!loading && products.length > 0 && (
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Tìm thấy <strong>{products.length}</strong> ưu đãi trong bán kính
              10km
            </p>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="hot-deal-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`hot-deal-filter-btn ${
                activeFilter === f ? "active" : ""
              } ${f === "Tất cả" ? "outline" : "filled"}`}
              onClick={() => {
                setActiveFilter(f);
                setStartIdx(0);
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid #e5e7eb",
                borderTop: "3px solid #f59e0b",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p>Đang tải ưu đãi gần bạn...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "32px",
              color: "#ef4444",
              background: "#fef2f2",
              borderRadius: "12px",
              margin: "16px 0",
            }}
          >
            <p>⚠️ {error}</p>
            <button
              onClick={() => setError(null)}
              style={{
                marginTop: "12px",
                padding: "8px 20px",
                background: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && (
          <div className="hot-deal-grid">
            {visible.length > 0 ? (
              visible.map((product) => (
                <div className="deal-card" key={product.itemId}>
                  <div className="deal-card-img" style={{ position: "relative" }}>
                    <img
                      src={
                        product.imageUrl ||
                        "https://placehold.co/300x200?text=No+Image"
                      }
                      alt={product.itemName}
                    />
                    {/* Badge giảm giá */}
                    {product.discountPercentage > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          background: "#ef4444",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    )}
                    {/* Badge khoảng cách */}
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "20px",
                      }}
                    >
                      📍 {product.distanceKm != null
                        ? `${product.distanceKm} km`
                        : "N/A"}
                    </span>
                  </div>

                  <div className="deal-card-body">
                    <div className="deal-card-top">
                      <span className="deal-name">{product.itemName}</span>
                      <button
                        className="add-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Thêm vào giỏ
                      </button>
                    </div>

                    {/* Tên quán */}
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#374151",
                        margin: "4px 0",
                        lineHeight: 1.4,
                        fontWeight: 600,
                      }}
                    >
                      🏪 {product.supplierName}
                    </p>

                    {/* Địa chỉ quán */}
                    {product.supplierAddress && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#6b7280",
                          margin: "2px 0",
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={product.supplierAddress}
                      >
                        🗺️ {product.supplierAddress}
                      </p>
                    )}

                    {/* Khoảng cách */}
                    {product.distanceKm != null && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#f59e0b",
                          margin: "2px 0",
                          fontWeight: 600,
                        }}
                      >
                        📍 Cách bạn {product.distanceKm} km
                      </p>
                    )}

                    <div className="deal-card-bottom">
                      <StarRating count={product.supplierRating || 0} />
                      <div className="deal-price-row">
                        <div>
                          {product.originalPrice > product.discountedPrice && (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#9ca3af",
                                textDecoration: "line-through",
                                display: "block",
                              }}
                            >
                              {formatVND(product.originalPrice)}
                            </span>
                          )}
                          <span className="deal-price">
                            {formatVND(product.discountedPrice)}
                          </span>
                        </div>
                        <button
                          className="buy-now-btn"
                          onClick={() => handleBuyNow(product)}
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">
                Không có sản phẩm nào trong danh mục này.{" "}
                {onChangeLocation && (
                  <button
                    onClick={onChangeLocation}
                    style={{
                      color: "#f59e0b",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Đổi vị trí?
                  </button>
                )}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        {!loading && !error && filtered.length > CARDS_PER_VIEW && (
          <div className="hot-deal-nav">
            <button
              className="nav-arrow-btn"
              onClick={handlePrev}
              disabled={!canPrev}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="nav-arrow-btn"
              onClick={handleNext}
              disabled={!canNext}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HotDealSection;
