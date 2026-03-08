import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import { paymentService } from "../services/paymentService";
import "./PaymentResult.css";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const [orderCode, setOrderCode] = useState(null);

  useEffect(() => {
    const codeFromUrl = searchParams.get("orderCode");
    const codeFromSession = sessionStorage.getItem("pendingOrderCode");
    const code = codeFromUrl || codeFromSession;

    if (code) {
      setOrderCode(code);
      // Optionally call cancel API to mark order as cancelled
      paymentService.cancelOrder(code).catch(console.error);
      sessionStorage.removeItem("pendingOrderCode");
    }
  }, [searchParams]);

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">
        <div className="result-icon cancel">
          <XCircle size={40} />
        </div>
        <h2 className="cancel">Thanh toán bị hủy</h2>
        <p>Bạn đã hủy quá trình thanh toán.</p>
        {orderCode && (
          <p style={{ fontSize: 13, color: "#9ca3af" }}>
            Mã đơn hàng: #{orderCode}
          </p>
        )}
        <p style={{ marginTop: 12 }}>
          Giỏ hàng của bạn đã được xóa. Bạn có thể thêm lại và thử thanh toán
          lần nữa.
        </p>

        <div className="result-actions" style={{ marginTop: 28 }}>
          <Link to="/main-menu" className="btn-result-primary">
            Quay lại thực đơn
          </Link>
          <Link to="/" className="btn-result-secondary">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
