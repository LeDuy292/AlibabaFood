import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../contexts/CartContext";
import { paymentService } from "../services/paymentService";
import "./Checkout.css";

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();

  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerAddress: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const validate = () => {
    const newErrors = {};
    if (!form.buyerName.trim()) newErrors.buyerName = "Vui lòng nhập họ tên.";
    if (!form.buyerPhone.trim())
      newErrors.buyerPhone = "Vui lòng nhập số điện thoại.";
    else if (!/^[0-9]{9,11}$/.test(form.buyerPhone.trim()))
      newErrors.buyerPhone = "Số điện thoại không hợp lệ.";
    if (form.buyerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail))
      newErrors.buyerEmail = "Email không hợp lệ.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        buyerName: form.buyerName.trim(),
        buyerEmail: form.buyerEmail.trim() || null,
        buyerPhone: form.buyerPhone.trim(),
        buyerAddress: form.buyerAddress.trim() || null,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await paymentService.createPaymentLink(orderData);

      // Save orderCode so success/cancel pages can query it
      sessionStorage.setItem("pendingOrderCode", String(result.orderCode));
      clearCart();

      // Redirect to PayOS checkout page
      window.location.href = result.checkoutUrl;
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate("/cart")}>
            <ArrowLeft size={18} /> Giỏ hàng
          </button>
          <h1>Thanh toán</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            {/* Buyer info form */}
            <div className="checkout-form-card">
              <h2>Thông tin người mua</h2>

              <div className="form-group">
                <label>
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="buyerName"
                  value={form.buyerName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className={errors.buyerName ? "error" : ""}
                />
                {errors.buyerName && (
                  <p className="form-error">{errors.buyerName}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="buyerPhone"
                  value={form.buyerPhone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  className={errors.buyerPhone ? "error" : ""}
                />
                {errors.buyerPhone && (
                  <p className="form-error">{errors.buyerPhone}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Email{" "}
                  <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                    (tùy chọn)
                  </span>
                </label>
                <input
                  type="email"
                  name="buyerEmail"
                  value={form.buyerEmail}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={errors.buyerEmail ? "error" : ""}
                />
                {errors.buyerEmail && (
                  <p className="form-error">{errors.buyerEmail}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Địa chỉ giao hàng{" "}
                  <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                    (tùy chọn)
                  </span>
                </label>
                <input
                  type="text"
                  name="buyerAddress"
                  value={form.buyerAddress}
                  onChange={handleChange}
                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="checkout-summary-card">
              <h2>Đơn hàng của bạn</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatVND(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr className="summary-divider" />
              <div className="summary-total">
                <span>Tổng cộng</span>
                <span>{formatVND(totalAmount)}</span>
              </div>

              <button type="submit" className="btn-pay" disabled={loading}>
                {loading ? (
                  <>
                    <span className="checkout-spinner" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} /> Thanh toán qua PayOS
                  </>
                )}
              </button>

              <div className="payos-logo-row">
                <span>Được bảo mật bởi</span>
                <span className="payos-badge">PayOS</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
