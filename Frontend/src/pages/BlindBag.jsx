import React, { useState, useRef, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Html,
  Environment,
  ContactShadows,
  SpotLight,
  Float,
  Sparkles,
  Image,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Noise,
} from "@react-three/postprocessing";
import * as THREE from "three";
import Navbar from "../components/Navbar";
import "./BlindBag.css";

const PRIZES = [
  {
    id: 1,
    name: "Wagyu Burger Đặc Biệt",
    discount: "Free Đồ Uống",
    rarity: "Legendary",
    color: "#FFD166",
    glow: "#FFD166",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    expire: "HSD: 24h",
    desc: "Thưởng thức bò Wagyu thượng hạng.",
    weight: 5, // Tỷ lệ 5%
  },
  {
    id: 2,
    name: "Sushi Omakase",
    discount: "Giảm 50%",
    rarity: "Epic",
    color: "#7B61FF",
    glow: "#a28bff",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600",
    expire: "HSD: 48h",
    desc: "Set Sushi nguyên liệu tươi mới mỗi ngày.",
    weight: 10, // Tỷ lệ 10%
  },
  {
    id: 3,
    name: "Pizza Hải Sản",
    discount: "Giảm 30K",
    rarity: "Rare",
    color: "#00C6FF",
    glow: "#5ce1e6",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    expire: "HSD: 24h",
    desc: "Hải sản nướng đá lò cuộn phô mai.",
    weight: 15, // Tỷ lệ 15%
  },
  {
    id: 4,
    name: "Gà Rán Xì Dầu",
    discount: "Freeship",
    rarity: "Uncommon",
    color: "#00C6FF",
    glow: "#5ce1e6",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ba?auto=format&fit=crop&q=80&w=600",
    expire: "HSD: 12h",
    desc: "Gà rán giòn rụm đậm vị Hàn Quốc.",
    weight: 50, // Tỷ lệ 50%
  },
  {
    id: 5,
    name: "Trà Sữa Trân Châu",
    discount: "Đồng Giá 1K",
    rarity: "Mythic",
    color: "#FF007F",
    glow: "#ff4d94",
    image:
      "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=600",
    expire: "HSD: Trong 3 ngày",
    desc: "Ly trà sữa size L, trân châu hoàng kim.",
    weight: 1, // Tỷ lệ 1%
  },
  {
    id: 6,
    name: "Mì Ý Tôm Hùm",
    discount: "Giảm 20%",
    rarity: "Common",
    color: "#00FA9A",
    glow: "#4ade80",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&q=80&w=600",
    expire: "HSD: 24h",
    desc: "Tinh hoa ẩm thực nước Ý tinh tế.",
    weight: 19, // Tỷ lệ 19%
  },
];

const CameraController = ({ phase }) => {
  useFrame((state) => {
    // Smooth camera movement based on phase
    const targetZ = phase === "idle" ? 12 : phase === "reveal" ? 9 : 8;
    const targetY = phase === "idle" ? 2 : phase === "slot" ? 4 : 2;

    state.camera.position.lerp(new THREE.Vector3(0, targetY, targetZ), 0.05);
    state.camera.lookAt(0, 1, 0);
  });
  return null;
};

const MysteryBox = ({ phase }) => {
  const boxRef = useRef();

  useFrame((state, delta) => {
    if (!boxRef.current) return;

    if (phase === "idle") {
      boxRef.current.rotation.y += delta * 0.5;
      boxRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      boxRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    } else if (phase === "shaking") {
      // Túi mù bắt đầu xoay ngẫu nhiên trên các trục và rung lắc mạnh dần
      boxRef.current.rotation.x += delta * (5 + (state.clock.elapsedTime % 2));
      boxRef.current.rotation.y += delta * 15;
      boxRef.current.rotation.z += delta * (3 + (state.clock.elapsedTime % 3));

      boxRef.current.position.x = Math.sin(state.clock.elapsedTime * 40) * 0.15;
      boxRef.current.position.y = Math.cos(state.clock.elapsedTime * 45) * 0.15;
      // Phình to căng ra trước khi nổ
      boxRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.05);
    } else if (phase === "reveal") {
      // Hiệu ứng tàng hình / thu nhỏ cho túi mù lúc nổ
      boxRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.2);
    }
  });

  return (
    <group ref={boxRef}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshStandardMaterial color="#0F1020" roughness={0.3} metalness={0.8} />

        {/* Glowing decals on box */}
        <mesh position={[0, 0, 1.26]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial color="#FF7A00" transparent opacity={0.8} />
          <Html transform position={[0, 0, 0.01]} center>
            <div className="bb-myst-mark">?</div>
          </Html>
        </mesh>
        <mesh position={[0, 0, -1.26]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial color="#7B61FF" transparent opacity={0.8} />
          <Html transform position={[0, 0, 0.01]} center>
            <div className="bb-myst-mark">?</div>
          </Html>
        </mesh>
      </mesh>
    </group>
  );
};

// 3D representation of the prize that pops out
const PrizeModel = ({ phase, winner }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (phase === "reveal") {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      groupRef.current.rotation.y += delta * 1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.2);
    }
  });

  return (
    <group ref={groupRef} position={[0, 1, 0]} scale={[0, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial
          color={winner.color}
          roughness={0.2}
          metalness={0.8}
        />
        <Html
          transform
          zIndexRange={[100, 0]}
          distanceFactor={8}
          position={[0, 0, 0.11]}
        >
          <div
            className="slot-item-view hero-scaled"
            style={{ boxShadow: `0 0 30px ${winner.glow}` }}
          >
            <img src={winner.image} alt={winner.name} />
            <h4 style={{ color: winner.color }}>{winner.name}</h4>
          </div>
        </Html>
      </mesh>
    </group>
  );
};

const BlindBag = () => {
  const [phase, setPhase] = useState("idle");
  const [winningIndex, setWinningIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const navigate = useNavigate();

  const openBag = () => {
    // Ngăn chặn bấm liên tục
    if (phase !== "idle" || isOpening) return;
    setIsOpening(true);

    // Thuật toán quay số (RNG) dựa trên tỷ lệ rớt đồ (Weight)
    const totalWeight = PRIZES.reduce((acc, prize) => acc + prize.weight, 0);
    let randomVal = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < PRIZES.length; i++) {
      if (randomVal < PRIZES[i].weight) {
        selectedIndex = i;
        break;
      }
      randomVal -= PRIZES[i].weight;
    }
    setWinningIndex(selectedIndex);

    // Bắt đầu hoạt ảnh rung lắc
    setPhase("shaking");

    // Khởi động bộ đếm thời gian
    setTimeout(() => {
      setFlash(true);
      setPhase("reveal"); // Túi mù nổ, hiện UI và pháo giấy

      // Cập nhật dữ liệu & Hậu kiểm (Mock API Call)
      console.log(
        `[API MOCK] Ghi nhận user trúng giải: ${PRIZES[selectedIndex].name} (Weight: ${PRIZES[selectedIndex].weight})`,
      );

      setTimeout(() => setFlash(false), 500);
      setIsOpening(false);
    }, 4000); // Đợi 4 giây hồi hộp
  };

  const handlePlayAgain = () => {
    setPhase("idle");
  };

  const winner = PRIZES[winningIndex];

  return (
    <div className="bb-futuristic-page">
      <Navbar />

      {/* White Flash overlay */}
      <div className={`cam-flash ${flash ? "active" : ""}`}></div>

      <div className="bb-f-canvas-container">
        <Canvas shadows gl={{ antialias: false }}>
          <color attach="background" args={["#0F1020"]} />
          <CameraController phase={phase} />

          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
          <SpotLight
            position={[0, 10, 0]}
            angle={0.5}
            penumbra={1}
            intensity={phase === "reveal" ? 6 : 2}
            color={phase === "reveal" ? winner.color : "#7B61FF"}
            castShadow
          />

          {/* Atmospheric particles or Confetti */}
          <Sparkles
            count={phase === "reveal" ? 1500 : 400}
            scale={phase === "reveal" ? 50 : 20}
            size={phase === "reveal" ? 15 : 3}
            speed={phase === "reveal" ? 8 : 0.5}
            color={
              phase === "reveal"
                ? winner.color
                : phase === "shaking"
                  ? "#ff3333"
                  : "#FFD166"
            }
          />

          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <MysteryBox phase={phase} />
            </Float>
            <PrizeModel phase={phase} winner={winner} />
            <Environment preset="city" />
          </Suspense>

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.5}
            scale={40}
            blur={2}
            color="#000"
          />

          {/* Heavy post-processing to create modern glow & blur */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={phase === "shaking" ? 3 : 1.5}
              radius={0.8}
            />
            <Noise opacity={0.03} />
            {phase === "shaking" && (
              <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={2}
                height={480}
              />
            )}
          </EffectComposer>
        </Canvas>
      </div>

      {/* UI Layer */}
      <div className="bb-ui-layer">
        {phase === "idle" && (
          <div className="bb-idle-ui animate-fade-up">
            <div className="bb-badge-neon">Lootbox Premium</div>
            <h1>
              BÓC TÚI MÙ <br />
              <span className="text-glow">SĂN PHẦN THƯỞNG</span>
            </h1>
            <p>
              19,000VND / Lượt quay. Cơ hội nhận siêu phẩm Wagyu, Sushi Omakase
              và vô vàn Voucher cực sốc!
            </p>

            <button className="bb-cta-btn" onClick={openBag}>
              <span className="btn-icon">🎁</span> Bóc Ngay
              <div className="btn-particles"></div>
            </button>
          </div>
        )}

        {phase === "reveal" && (
          <div className="bb-reveal-ui animate-slide-up">
            <div className="bb-reward-card glassmorphism">
              <div
                className="bb-rc-rarity"
                style={{
                  color: winner.color,
                  borderColor: winner.color,
                  boxShadow: `0 0 15px ${winner.glow}`,
                }}
              >
                {winner.rarity}
              </div>

              <h2 style={{ textShadow: `0 0 20px ${winner.glow}` }}>
                {winner.name}
              </h2>
              <div className="bb-rc-badges">
                <span className="bb-badge-discount">🔥 {winner.discount}</span>
                <span className="bb-badge-expire">🕒 {winner.expire}</span>
              </div>

              <p className="bb-rc-desc">{winner.desc}</p>

              <div className="bb-rc-actions">
                <button
                  className="bb-rc-btn-primary"
                  onClick={() => navigate("/cart")}
                >
                  🛒 Thêm vào giỏ
                </button>
                <button
                  className="bb-rc-btn-secondary"
                  onClick={() => alert("Đã lưu mã vào ví!")}
                >
                  💳 Lưu vào ví
                </button>
                <button
                  className="bb-rc-btn-secondary"
                  onClick={handlePlayAgain}
                >
                  🎁 Bóc thêm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlindBag;
