import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { paymentService } from "../services/paymentService";
import "./PaymentResult.css";

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PayOS redirects with ?orderCode=xxx&status=PAID in URL
    const orderCodeFromUrl = searchParams.get("orderCode");
    const orderCodeFromSession = sessionStorage.getItem("pendingOrderCode");
    const orderCode = orderCodeFromUrl || orderCodeFromSession;

    if (orderCode) {
      paymentService
        .getOrder(orderCode)
        .then((data) => setOrder(data))
        .catch(console.error)
        .finally(() => setLoading(false));
      sessionStorage.removeItem("pendingOrderCode");
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">
        {loading ? (
          <>
            <div className="loading-spinner" />
            <p>Đang xác nhận thanh toán...</p>
          </>
        ) : (
          <>
            <div className="result-icon success">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="success">Thanh toán thành công!</h2>
            <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.</p>

            {order && (
              <div className="order-info-box">
                <div className="order-info-row">
                  <span>Mã đơn hàng:</span>
                  <span>#{order.orderCode}</span>
                </div>
                <div className="order-info-row">
                  <span>Người mua:</span>
                  <span>{order.buyerName}</span>
                </div>
                <div className="order-info-row">
                  <span>Tổng tiền:</span>
                  <span>{formatVND(order.totalAmount)}</span>
                </div>
                <div className="order-info-row">
                  <span>Trạng thái:</span>
                  <span style={{ color: "#059669" }}>Đã thanh toán</span>
                </div>
              </div>
            )}

            <div className="result-actions">
              <Link to="/main-menu" className="btn-result-primary">
                Tiếp tục mua hàng
              </Link>
              <Link to="/" className="btn-result-secondary">
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
