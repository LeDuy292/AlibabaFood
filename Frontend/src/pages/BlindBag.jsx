import React, { useState, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Environment, ContactShadows, SpotLight, Sparkles, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import './BlindBag.css';
import Navbar from '../components/Navbar';
import logoImg from '../assets/alibaba-logo.png.png';

const PRIZES = [
    { id: 1, name: 'Fried Chicken Combo', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ba?auto=format&fit=crop&q=80&w=200', color: '#f59e0b' },
    { id: 2, name: '50% Off Voucher', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=200', color: '#ec4899' },
    { id: 3, name: 'Free Shipping', image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&q=80&w=200', color: '#3b82f6' },
    { id: 4, name: 'Seafood Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200', color: '#ef4444' },
    { id: 5, name: 'Large Milk Tea', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=200', color: '#8b5cf6' },
    { id: 6, name: 'Free Side Dish', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200', color: '#10b981' },
];

const TOTAL_BAGS = PRIZES.length;
const RADIUS = 4.8; // Slightly wider for cinematic view

const Bag3D = ({ position, rotation, prize, isWinner, hasLanded }) => {
    const bagRef = useRef();

    useFrame((state) => {
        if (isWinner && hasLanded) {
            // Winning bag prominently floats up and faces the camera, scaling up to highlight it
            bagRef.current.position.y = THREE.MathUtils.lerp(bagRef.current.position.y, position[1] + 2.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15, 0.05);
            // Move bag outwards a bit for better visibility
            bagRef.current.position.x = THREE.MathUtils.lerp(bagRef.current.position.x, position[0] * 1.5, 0.05);
            bagRef.current.position.z = THREE.MathUtils.lerp(bagRef.current.position.z, position[2] * 1.5, 0.05);

            // Add a slight pitch forward to show off the prize
            bagRef.current.rotation.x = THREE.MathUtils.lerp(bagRef.current.rotation.x, 0.15, 0.05);

            // Scale up the winning bag
            const targetScale = 1.6;
            bagRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
        } else if (hasLanded && !isWinner) {
            // Hide other bags once landed to put all focus on the winner
            const targetScale = 0;
            bagRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        } else {
            // Reset to normal
            bagRef.current.position.x = THREE.MathUtils.lerp(bagRef.current.position.x, position[0], 0.1);
            bagRef.current.position.y = THREE.MathUtils.lerp(bagRef.current.position.y, position[1], 0.1);
            bagRef.current.position.z = THREE.MathUtils.lerp(bagRef.current.position.z, position[2], 0.1);
            bagRef.current.rotation.x = THREE.MathUtils.lerp(bagRef.current.rotation.x, 0, 0.1);

            const targetScale = 1;
            bagRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    const bodyColor = isWinner && hasLanded ? '#c4956a' : '#ba8c63';
    // When winning, make the bag slightly more reflective
    const roughness = isWinner && hasLanded ? 0.7 : 0.9;

    return (
        <group ref={bagRef} position={position} rotation={rotation}>
            {/* Bag Main Body */}
            <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
                <boxGeometry args={[1.8, 2.4, 1.2]} />
                <meshStandardMaterial color={bodyColor} roughness={roughness} metalness={0.1} />

                {/* HTML overlay attached flawlessly to the front face */}
                <Html transform position={[0, -0.1, 0.61]} distanceFactor={3.5} center zIndexRange={[100, 0]}>
                    <div className="bag-html-content">
                        {isWinner && hasLanded ? (
                            <div className="reveal-content-3d">
                                <img src={prize.image} alt={prize.name} className="prize-image-3d" />
                                <span className="prize-name-3d">{prize.name}</span>
                            </div>
                        ) : (
                            <div className="mystery-content-3d">
                                <img src={logoImg} alt="Alibaba Food" className="bag-logo-3d" />
                                <span className="mystery-mark-3d">?</span>
                            </div>
                        )}
                    </div>
                </Html>
            </mesh>
            {/* Bag Top Fold */}
            <mesh castShadow receiveShadow position={[0, 2.45, 0]}>
                <boxGeometry args={[1.8, 0.1, 0.4]} />
                <meshStandardMaterial color="#a47650" roughness={1} />
            </mesh>
        </group>
    );
};

const Carousel3D = ({ hasStarted, hasLanded, targetRot, winningIndex }) => {
    const groupRef = useRef();
    const currentRot = useRef(0);

    useFrame((state, delta) => {
        if (!hasStarted) {
            // Idle sway before interaction
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1 - 0.5;
        } else {
            // Cinematic Spin dampening
            currentRot.current = THREE.MathUtils.damp(currentRot.current, targetRot, 1.2, delta);
            groupRef.current.rotation.y = currentRot.current;
        }

        // Tilt the carousel slightly up when hidden for a more dramatic angle
        const targetPitch = hasStarted ? 0.05 : 0.2;
        const targetY = hasStarted ? -1 : -2.5;
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetPitch, 1.5, delta);
        if (hasStarted) {
            groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 1.5, delta);
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            {/* Elegant Cyber/Magical Podium below the bags */}
            <mesh receiveShadow position={[0, -0.1, 0]}>
                <cylinderGeometry args={[5.8, 6.2, 0.4, 64]} />
                <meshStandardMaterial color="#03150b" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Glowing Rings on Podium */}
            <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[5.2, 0.04, 16, 100]} />
                <meshBasicMaterial color="#34d399" toneMapped={false} />
            </mesh>
            <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[6.1, 0.08, 16, 100]} />
                <meshBasicMaterial color="#10b981" toneMapped={false} />
            </mesh>

            {PRIZES.map((prize, i) => {
                const angle = (i / TOTAL_BAGS) * Math.PI * 2;
                const x = Math.sin(angle) * RADIUS;
                const z = Math.cos(angle) * RADIUS;
                return (
                    <Bag3D
                        key={prize.id}
                        position={[x, 0, z]}
                        rotation={[0, angle, 0]}
                        prize={prize}
                        isWinner={i === winningIndex}
                        hasLanded={hasLanded}
                    />
                );
            })}
        </group>
    );
};

const BlindBag = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasLanded, setHasLanded] = useState(false);
    const [winningIndex, setWinningIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [targetRot, setTargetRot] = useState(0);

    const navigate = useNavigate();

    const openBlindBag = () => {
        if (isSpinning || hasLanded) return;

        setHasStarted(true);
        setIsSpinning(true);
        setHasLanded(false);
        setShowResult(false);

        const randomIndex = Math.floor(Math.random() * TOTAL_BAGS);
        setWinningIndex(randomIndex);

        // Calculate rotation ensuring it spins many times for intense suspense from its CURRENT position
        const theta = (randomIndex / TOTAL_BAGS) * Math.PI * 2;
        const extraSpins = 14 * Math.PI * 2;

        // Ensure new target rotation always spins forward (subtracting angle goes clockwise)
        const currentRotNormalized = targetRot % (Math.PI * 2);
        setTargetRot(targetRot - extraSpins - (currentRotNormalized + theta));

        // Extended dramatic timeout for intense suspense
        setTimeout(() => {
            setHasLanded(true);
            setIsSpinning(false);

            setTimeout(() => {
                setShowResult(true);
            }, 1200); // Slight pause after landing before modal pops up
        }, 11500);
    };

    const handleReset = () => {
        setHasStarted(false);
        setHasLanded(false);
        setShowResult(false);
        setWinningIndex(null);
        // Do not reset targetRot to 0, otherwise it aggressively rewinds
        // Keep the wheel at its last spun position so the next spin is smooth
    };

    return (
        <div className="blind-bag-page">
            <Navbar />

            {/* True 3D Canvas via React Three Fiber */}
            <div className="canvas-wrapper">
                <Canvas shadows camera={{ position: [0, 6, 18], fov: 42 }}>
                    <color attach="background" args={['#020a06']} />
                    <fog attach="fog" args={['#020a06', 15, 35]} />

                    {/* Brighter Atmospheric Lighting */}
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
                    <directionalLight position={[-10, 5, -10]} intensity={0.8} color="#34d399" />
                    {/* Fill light from the center to brighten the box front faces */}
                    <pointLight position={[0, 4, 0]} intensity={2.5} color="#a7f3d0" distance={20} />

                    {/* Cinematic Spotlight on winner */}
                    {(isSpinning || hasLanded) && (
                        <SpotLight
                            position={[0, 22, 2]}
                            angle={0.25}
                            penumbra={1}
                            intensity={hasLanded ? 15 : (isSpinning ? 2 : 0)}
                            color="#34d399"
                            castShadow
                            distance={50}
                        />
                    )}

                    {/* Ambient Magical Particles */}
                    <Sparkles count={250} scale={25} size={3} speed={0.5} opacity={0.6} color="#a7f3d0" />

                    <Suspense fallback={null}>
                        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                            <Carousel3D
                                hasStarted={hasStarted}
                                hasLanded={hasLanded}
                                targetRot={targetRot}
                                winningIndex={winningIndex}
                            />
                        </Float>
                        <Environment preset="city" />
                    </Suspense>

                    <ContactShadows position={[0, -2.5, 0]} opacity={0.8} scale={35} blur={2.5} far={5} color="#000000" />

                    {/* Post Processing for Premium Look */}
                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.5} radius={0.8} />
                        <Vignette eskil={false} offset={0.05} darkness={1.2} />
                    </EffectComposer>
                </Canvas>
            </div>

            {/* Premium UI Overlay */}
            <div className={`game-controls modern-glass-panel ${(isSpinning || hasLanded) ? 'hidden' : ''}`}>
                <div className="glass-inner">
                    <div className="badge-exclusive">🎁 MYSTERY REWARD</div>
                    <h1 className="game-title">EXCLUSIVE <br /><span>CULINARY BLIND BAG</span></h1>
                    <p className="game-subtitle">Each bag contains a perfect surprise. Discover the gift crafted just for you!</p>

                    <div className="action-area">
                        <button
                            className="open-bag-btn premium-glow-btn"
                            onClick={openBlindBag}
                            disabled={isSpinning}
                        >
                            <span className="btn-content">
                                {isSpinning ? 'SPINNING...' : 'START SPIN (19,000VND)'}
                                {!isSpinning && <span className="btn-icon">✨</span>}
                            </span>
                            <div className="btn-glow-aura"></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Splendid Result Modal */}
            {showResult && winningIndex !== null && (
                <div className="result-modal-backdrop modern-backdrop">
                    <div className="result-modal modern-modal">
                        <div className="confetti modern-confetti">✨</div>
                        <h2 className="gradient-text">Congratulations!</h2>
                        <p>Luck has smiled upon you, you received:</p>
                        <div className="result-prize-display">
                            <img src={PRIZES[winningIndex].image} alt={PRIZES[winningIndex].name} className="result-prize-image" style={{ borderColor: PRIZES[winningIndex].color, boxShadow: `0 15px 35px ${PRIZES[winningIndex].color}55` }} />
                        </div>
                        <div className="prize-box premium-box" style={{ background: `linear-gradient(135deg, ${PRIZES[winningIndex].color}22 0%, rgba(20,20,25,0.9) 100%)`, borderColor: PRIZES[winningIndex].color }}>
                            {PRIZES[winningIndex].name}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-claim modern-btn" onClick={() => navigate('/menu')}>Use Now</button>
                            <button className="btn-play-again modern-outline-btn" onClick={handleReset}>Play Again</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlindBag;
