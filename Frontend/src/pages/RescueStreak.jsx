import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Flame,
  Award,
  Gift,
  Calendar,
  Sparkles,
  TrendingUp,
  Share2,
  Lock,
  CheckCircle,
  Copy,
  Info,
  Leaf,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import "./RescueStreak.css";

const formatVND = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const RescueStreak = () => {
  const navigate = useNavigate();

  // Load streak state from localStorage or use defaults
  const [streakData, setStreakData] = useState(() => {
    try {
      const saved = localStorage.getItem("rescueStreak");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      currentStreak: 4,
      longestStreak: 12,
      totalSavedKg: 8.5,
      co2SavedKg: 21.2,
      lastCheckIn: "",
      history: [true, true, true, true, false, false, false], // Day 1-7
    };
  });

  const [activeBadge, setActiveBadge] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Badges lists
  const badges = [
    {
      id: "rookie",
      title: "Chiến Binh Mới",
      desc: "Giải cứu thành công bữa ăn đầu tiên.",
      icon: Leaf,
      unlocked: true,
      color: "#10B981",
      date: "25/05/2026",
    },
    {
      id: "streak3",
      title: "Lửa Bất Diệt",
      desc: "Duy trì chuỗi giải cứu thực phẩm 3 ngày liên tiếp.",
      icon: Flame,
      unlocked: true,
      color: "#F59E0B",
      date: "27/05/2026",
    },
    {
      id: "eco5",
      title: "Hiệp Sĩ Xanh",
      desc: "Tiết kiệm hơn 5kg thực phẩm thừa khỏi bị lãng phí.",
      icon: ShieldCheck,
      unlocked: true,
      color: "#3B82F6",
      date: "28/05/2026",
    },
    {
      id: "bag_master",
      title: "Chúa Tể Blind Bag",
      desc: "Giải cứu thành công 5 Túi Bất Ngờ.",
      icon: ShoppingBag,
      unlocked: false,
      color: "#8B5CF6",
      requirement: "Giải cứu thêm 1 túi bất ngờ để mở khóa",
    },
    {
      id: "legend10",
      title: "Huyền Thoại Zero Waste",
      desc: "Duy trì chuỗi giải cứu 10 ngày liên tiếp.",
      icon: Award,
      unlocked: false,
      color: "#EF4444",
      requirement: "Duy trì chuỗi thêm 6 ngày để mở khóa",
    },
  ];

  // Daily quests
  const quests = [
    {
      id: 1,
      title: "Giải cứu trước hoàng hôn",
      desc: "Mua một phần ăn bất kỳ trước 18:00 hôm nay.",
      progress: "0/1",
      completed: false,
      reward: "+1 ngày chuỗi & 10 điểm",
    },
    {
      id: 2,
      title: "Giải cứu nhân đôi",
      desc: "Giải cứu từ 2 cửa hàng khác nhau trong ngày.",
      progress: "1/2",
      completed: false,
      reward: "Voucher giảm 15% & 20 điểm",
    },
    {
      id: 3,
      title: "Lan tỏa thông điệp xanh",
      desc: "Chia sẻ chuỗi giải cứu của bạn lên mạng xã hội.",
      progress: "1/1",
      completed: true,
      reward: "Voucher Freeship & 5 điểm",
    },
  ];

  // Rewards/Vouchers list
  const rewards = [
    {
      id: "voucher3",
      title: "Voucher Giảm 15%",
      desc: "Phần thưởng duy trì chuỗi 3 ngày liên tiếp",
      code: "RESCUE3D",
      minStreak: 3,
      unlocked: true,
    },
    {
      id: "voucher5",
      title: "Voucher Miễn Phí Vận Chuyển",
      desc: "Phần thưởng duy trì chuỗi 5 ngày liên tiếp",
      code: "FREESHIP5D",
      minStreak: 5,
      unlocked: false, // unlocked if streak >= 5
    },
    {
      id: "mystery_bag",
      title: "Free Mystery Bag (Túi Bất Ngờ)",
      desc: "Giải cứu thực phẩm 7 ngày liên tiếp để nhận túi miễn phí",
      code: "FREEMYSBAG",
      minStreak: 7,
      unlocked: false,
    },
  ];

  const handleCheckIn = () => {
    const todayStr = new Date().toDateString();
    if (streakData.lastCheckIn === todayStr) {
      toast.error("Hôm nay bạn đã thực hiện điểm danh giải cứu rồi!");
      return;
    }

    // Perform check-in animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);

    const updatedHistory = [...streakData.history];
    // Find first false day in history to mark true
    const firstFalseIndex = updatedHistory.findIndex((d) => !d);
    if (firstFalseIndex !== -1) {
      updatedHistory[firstFalseIndex] = true;
    } else {
      // If all true, reset history but keep streak going (new week)
      updatedHistory.fill(false);
      updatedHistory[0] = true;
    }

    const nextStreak = streakData.currentStreak + 1;
    const nextLongest = Math.max(nextStreak, streakData.longestStreak);
    const nextSavedKg = parseFloat((streakData.totalSavedKg + 1.2).toFixed(1));
    const nextCo2Saved = parseFloat((streakData.co2SavedKg + 3.0).toFixed(1));

    const newData = {
      currentStreak: nextStreak,
      longestStreak: nextLongest,
      totalSavedKg: nextSavedKg,
      co2SavedKg: nextCo2Saved,
      lastCheckIn: todayStr,
      history: updatedHistory,
    };

    setStreakData(newData);
    localStorage.setItem("rescueStreak", JSON.stringify(newData));
    toast.success("Điểm danh thành công! Chuỗi lửa tăng lên " + nextStreak + " ngày! 🔥");
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã voucher: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const shareStreak = () => {
    toast.success("Đã chuẩn bị liên kết chia sẻ chuỗi ngày xanh của bạn! 🌿");
  };

  return (
    <div className="streak-page">
      {showConfetti && (
        <div className="confetti-overlay">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ["#10B981", "#F59E0B", "#3B82F6", "#EC4899", "#8B5CF6"][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}

      <div className="streak-hero-section">
        <div className="streak-container">
          <div className="hero-grid">
            <div className="hero-text">
              <span className="badge-promo">GAMIFICATION REWARDS</span>
              <h1>Chuỗi Giải Cứu Thực Phẩm</h1>
              <p>
                Duy trì chuỗi ngày ăn uống xanh bảo vệ môi trường, giảm phát thải khí nhà kính và nhận về các huy hiệu độc quyền, voucher giảm giá cực sâu cùng Túi Bất Ngờ miễn phí!
              </p>
              <div className="hero-buttons">
                <button className="btn-primary-streak" onClick={handleCheckIn}>
                  <Sparkles size={18} /> Giải Cứu Ngay Hôm Nay
                </button>
                <button className="btn-secondary-streak" onClick={shareStreak}>
                  <Share2 size={18} /> Chia Sẻ Chuỗi
                </button>
              </div>
            </div>

            {/* Streak card widget */}
            <div className="hero-widget-card">
              <div className="flame-container">
                <Flame size={72} className="animated-flame" />
                <div className="flame-glow"></div>
              </div>
              <div className="streak-counter">
                <h2>{streakData.currentStreak} Ngày</h2>
                <p>Chuỗi lửa hiện tại 🔥</p>
              </div>
              <div className="streak-divider"></div>
              <div className="streak-mini-stats">
                <div>
                  <h4>{streakData.longestStreak} ngày</h4>
                  <span>Kỷ lục dài nhất</span>
                </div>
                <div>
                  <h4>{streakData.totalSavedKg} kg</h4>
                  <span>Thực phẩm đã giải cứu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="streak-container">
        {/* Weekly progress section */}
        <section className="streak-section">
          <div className="section-header">
            <Calendar size={24} color="#10B981" />
            <h2>Chuỗi Ngày Giải Cứu Trong Tuần</h2>
          </div>
          <p className="section-desc">
            Hoàn thành ít nhất một đơn hàng giải cứu thực phẩm hoặc Túi Bất Ngờ mỗi ngày để duy trì lửa chuỗi.
          </p>

          <div className="weekly-track">
            {streakData.history.map((checked, index) => {
              const dayNum = index + 1;
              const isToday = index === streakData.history.findIndex((d) => !d);
              return (
                <div
                  key={index}
                  className={`day-node ${checked ? "completed" : ""} ${isToday ? "today" : ""}`}
                >
                  <div className="day-circle">
                    {checked ? (
                      <CheckCircle size={24} className="check-icon" />
                    ) : isToday ? (
                      <Flame size={20} className="pulse-flame" />
                    ) : (
                      <span className="day-number">{dayNum}</span>
                    )}
                  </div>
                  <span className="day-label">Ngày {dayNum}</span>
                </div>
              );
            })}
          </div>

          <div className="progress-summary">
            <div className="progress-text-row">
              <span>Đường tới Mystery Bag miễn phí</span>
              <span>
                {streakData.history.filter(Boolean).length}/7 ngày hoàn thành
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill animate-progress"
                style={{
                  width: `${(streakData.history.filter(Boolean).length / 7) * 100}%`,
                }}
              ></div>
            </div>
            <span className="progress-tip">
              💡 Tip: Mua 1 Túi Bất Ngờ (Mystery Bag) bất kỳ hôm nay để thắp sáng ngày tiếp theo trên chuỗi!
            </span>
          </div>
        </section>

        {/* Eco contribution and badges */}
        <div className="streak-row-grid">
          {/* Badge locker */}
          <section className="streak-section badge-locker-card">
            <div className="section-header">
              <Award size={24} color="#F59E0B" />
              <h2>Bộ Sưu Tập Huy Hiệu</h2>
            </div>
            <p className="section-desc">
              Các cột mốc vinh danh nỗ lực bảo vệ Trái Đất của bạn.
            </p>

            <div className="badges-grid">
              {badges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`badge-item ${badge.unlocked ? "unlocked" : "locked"}`}
                    onClick={() => setActiveBadge(badge)}
                  >
                    <div
                      className="badge-icon-wrapper"
                      style={{
                        backgroundColor: badge.unlocked ? `${badge.color}15` : "#374151",
                        borderColor: badge.unlocked ? badge.color : "#4B5563",
                      }}
                    >
                      {badge.unlocked ? (
                        <IconComponent size={28} color={badge.color} />
                      ) : (
                        <Lock size={20} color="#9CA3AF" />
                      )}
                    </div>
                    <span className="badge-title">{badge.title}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Eco stats */}
          <section className="streak-section eco-contribution-card">
            <div className="section-header">
              <Leaf size={24} color="#10B981" />
              <h2>Đóng Góp Sinh Thái</h2>
            </div>
            <p className="section-desc">
              Thống kê lượng khí CO2 và thực phẩm rác thải bạn đã gián tiếp ngăn chặn khỏi khí quyển.
            </p>

            <div className="eco-stats-list">
              <div className="eco-stat-item">
                <div className="eco-stat-icon green">
                  <Leaf size={24} />
                </div>
                <div>
                  <h3>{streakData.totalSavedKg} kg</h3>
                  <p>Lượng thực phẩm đã cứu sống</p>
                </div>
              </div>
              <div className="eco-stat-item">
                <div className="eco-stat-icon orange">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3>{streakData.co2SavedKg} kg CO2</h3>
                  <p>Khí CO2 đã ngăn chặn phát thải</p>
                </div>
              </div>
              <div className="eco-stat-item">
                <div className="eco-stat-icon blue">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3>{Math.floor(streakData.totalSavedKg * 1.5)} cây xanh</h3>
                  <p>Đương đương số cây trồng xanh 1 năm</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Voucher rewards list */}
        <section className="streak-section">
          <div className="section-header">
            <Gift size={24} color="#EF4444" />
            <h2>Phần Thưởng Đổi Quà Chuỗi</h2>
          </div>
          <p className="section-desc">
            Voucher sẽ tự động khả dụng khi bạn duy trì đạt mốc ngày tương ứng. Click để lấy mã giảm giá áp dụng vào giỏ hàng.
          </p>

          <div className="rewards-grid">
            {rewards.map((reward) => {
              const isEligible = streakData.currentStreak >= reward.minStreak;
              return (
                <div
                  key={reward.id}
                  className={`reward-card ${isEligible ? "unlocked" : "locked"}`}
                >
                  <div className="reward-icon-box">
                    <Gift size={32} />
                  </div>
                  <div className="reward-info">
                    <h3>{reward.title}</h3>
                    <p>{reward.desc}</p>
                    <span className="reward-requirement">
                      {isEligible ? "✅ Đã đủ điều kiện!" : `🔒 Yêu cầu chuỗi từ ${reward.minStreak} ngày trở lên`}
                    </span>
                  </div>
                  <div className="reward-action">
                    {isEligible ? (
                      <button
                        className="btn-copy-code"
                        onClick={() => copyCode(reward.code)}
                      >
                        {copiedCode === reward.code ? (
                          "Đã copy!"
                        ) : (
                          <>
                            <Copy size={16} /> Copy: {reward.code}
                          </>
                        )}
                      </button>
                    ) : (
                      <button className="btn-locked-reward" disabled>
                        <Lock size={14} /> Khóa
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Daily missions/quests */}
        <section className="streak-section">
          <div className="section-header">
            <Sparkles size={24} color="#8B5CF6" />
            <h2>Nhiệm Vụ Hàng Ngày</h2>
          </div>
          <p className="section-desc">
            Tích lũy thêm điểm thưởng và củng cố chuỗi thói quen bền vững.
          </p>

          <div className="quests-list">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`quest-item ${quest.completed ? "completed" : ""}`}
              >
                <div className="quest-checkbox">
                  {quest.completed ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <div className="circle-incomplete" />
                  )}
                </div>
                <div className="quest-details">
                  <h4>{quest.title}</h4>
                  <p>{quest.desc}</p>
                </div>
                <div className="quest-reward-pill">{quest.reward}</div>
                <div className="quest-progress">{quest.progress}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Glassmorphic Modal for Active Badge */}
      {activeBadge && (
        <div className="badge-modal-overlay" onClick={() => setActiveBadge(null)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveBadge(null)}>
              &times;
            </button>
            <div
              className="modal-badge-wrapper"
              style={{
                backgroundColor: activeBadge.unlocked ? `${activeBadge.color}15` : "#1F2937",
                borderColor: activeBadge.unlocked ? activeBadge.color : "#4B5563",
              }}
            >
              {activeBadge.unlocked ? (
                <activeBadge.icon size={64} color={activeBadge.color} />
              ) : (
                <Lock size={48} color="#9CA3AF" />
              )}
            </div>
            <h2>{activeBadge.title}</h2>
            <div className="modal-badge-status">
              {activeBadge.unlocked ? (
                <span className="unlocked-text">🌿 Đã mở khóa ngày {activeBadge.date}</span>
              ) : (
                <span className="locked-text">🔒 Chưa mở khóa</span>
              )}
            </div>
            <p className="modal-badge-desc">{activeBadge.desc}</p>
            {!activeBadge.unlocked && (
              <div className="badge-requirement-box">
                <Info size={16} />
                <span>{activeBadge.requirement}</span>
              </div>
            )}
            <div className="modal-actions">
              {activeBadge.unlocked ? (
                <button
                  className="btn-modal-primary"
                  onClick={() => {
                    toast.success("Khoe huy hiệu thành công!");
                    setActiveBadge(null);
                  }}
                >
                  <Share2 size={16} /> Khoe Huy Hiệu
                </button>
              ) : (
                <button
                  className="btn-modal-primary"
                  onClick={() => {
                    setActiveBadge(null);
                    navigate("/main-menu");
                  }}
                >
                  Giải Cứu Thực Phẩm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescueStreak;
