import React, { useEffect, useState } from "react";
import "./ComboDealSection.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getNearbyProducts } from "../services/productService";

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount) + "đ";

const CARDS_PER_VIEW = 3;

const StarRating = ({ count }) => (
  <div className="combo-star-rating">
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

const SmileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
    <path
      d="M8 14s1.5 2 4 2 4-2 4-2"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="9" cy="10" r="1" fill="white" />
    <circle cx="15" cy="10" r="1" fill="white" />
  </svg>
);

const ComboDealSection = ({ userLocation, onChangeLocation }) => {
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
        // Lấy sản phẩm combo — dùng bán kính 10km, sort theo giảm giá cao nhất
        const result = await getNearbyProducts(
          userLocation.lat,
          userLocation.lng,
          5
        );
        // Ưu tiên những sản phẩm có giảm giá (combo deals)
        const sorted = (result?.data || []).sort(
          (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
        );
        setProducts(sorted);
        setStartIdx(0);
      } catch (err) {
        console.error("Lỗi tải combo deal:", err);
        setError("Không thể tải combo deal. Vui lòng thử lại.");
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

  const visible = products.slice(startIdx, startIdx + CARDS_PER_VIEW);
  const canPrev = startIdx > 0;
  const canNext = startIdx < products.length - CARDS_PER_VIEW;

  if (!userLocation) return null;

  return (
    <section className="combo-deal-section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <div className="combo-label-pill" style={{ margin: "0 0 10px 0" }}>
            Combo Deal
          </div>
          {!loading && products.length > 0 && (
            <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
              {products.length} ưu đãi combo gần bạn trong bán kính 10km
            </p>
          )}
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
            <p>Đang tải combo gần bạn...</p>
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
          <div className="combo-grid">
            {visible.length > 0 ? (
              visible.map((product) => (
                <div className="combo-card" key={product.itemId}>
                  {/* Smile icon top-right */}
                  <div className="combo-smile-btn">
                    <SmileIcon />
                  </div>

                  {/* Discount badge */}
                  {product.discountPercentage > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        background: "#ef4444",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "20px",
                        zIndex: 2,
                      }}
                    >
                      -{Math.round(product.discountPercentage)}%
                    </div>
                  )}

                  {/* Circular image */}
                  <div className="combo-card-img" style={{ position: "relative" }}>
                    <img
                      src={
                        product.imageUrl ||
                        "https://placehold.co/300x200?text=No+Image"
                      }
                      alt={product.itemName}
                    />
                    {/* Distance badge */}
                    {product.distanceKm != null && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          background: "rgba(0,0,0,0.65)",
                          color: "white",
                          fontSize: "10px",
                          padding: "1px 6px",
                          borderRadius: "20px",
                        }}
                      >
                        📍 {product.distanceKm}km
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="combo-card-body">
                    <div className="combo-card-top">
                      <span className="combo-name">{product.itemName}</span>
                      <button
                        className="combo-add-cart-btn"
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
                        margin: "4px 0 2px",
                        fontWeight: 600,
                        lineHeight: 1.4,
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
                          fontSize: "11px",
                          color: "#f59e0b",
                          margin: "2px 0",
                          fontWeight: 600,
                        }}
                      >
                        📍 Cách bạn {product.distanceKm} km
                      </p>
                    )}

                    <div className="combo-card-bottom">
                      <StarRating count={product.supplierRating || 0} />
                      <div className="combo-price-row">
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
                          <span className="combo-price">
                            {formatVND(product.discountedPrice)}
                          </span>
                        </div>
                        <button
                          className="combo-buy-now-btn"
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
              <p style={{ color: "#6b7280", padding: "20px 0" }}>
                Không có combo nào gần bạn.{" "}
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
        {!loading && !error && products.length > CARDS_PER_VIEW && (
          <div className="combo-nav">
            <button
              className="combo-nav-btn"
              onClick={() => setStartIdx((i) => Math.max(0, i - 1))}
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
              className="combo-nav-btn"
              onClick={() =>
                setStartIdx((i) =>
                  Math.min(products.length - CARDS_PER_VIEW, i + 1)
                )
              }
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

export default ComboDealSection;
