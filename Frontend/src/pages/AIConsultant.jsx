import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import './AIConsultant.css';

const AIConsultant = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Xin chào bạn, tôi là nhân viên ảo của Alibaba Food, tôi có thể giúp gì cho bạn?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesListRef = useRef(null);

    const suggestions = [
        "Gợi ý món ăn cay",
        "Món ngon cho bữa tối",
        "Đặc sản Việt Nam",
        "Món ăn healthy",
        "Bữa sáng nhẹ nhàng"
    ];

    const scrollToBottom = (force = false) => {
        const container = messagesListRef.current;
        if (!container) return;

        // Only auto-scroll if message is forced (user sent) or user is already near bottom
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 300;

        if (force || isNearBottom) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // Trigger scroll when messages change
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        // Always scroll for user messages, only scroll for AI if user is at bottom
        scrollToBottom(lastMessage?.sender === 'user');
    }, [messages]);

    // Also scroll when loading state changes (dots appear/disappear)
    useEffect(() => {
        if (loading) {
            scrollToBottom(true);
        }
    }, [loading]);

    const handleSend = async (messageText = input) => {
        if (!messageText.trim() || loading) return;

        const userMessage = { id: Date.now(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/ai/consult', {
                question: messageText,
                dietaryPreferences: "",
                allergies: "",
                includeVoiceResponse: false
            });

            if (response.data) {
                const aiResponseText = response.data.textResponse || response.data.message;

                const aiResponse = {
                    id: Date.now() + 1,
                    text: aiResponseText,
                    sender: 'ai',
                    recommendations: response.data.recommendations || response.data.foodSuggestions
                };
                setMessages(prev => [...prev, aiResponse]);

                try {
                    const ttsResponse = await api.post('/ai/tts', { text: aiResponseText });
                    if (ttsResponse.data && ttsResponse.data.audioBase64) {
                        const audio = new Audio(`data:audio/mpeg;base64,${ttsResponse.data.audioBase64}`);
                        audio.play().catch(e => console.warn('Audio play failed:', e));
                    }
                } catch (ttsErr) {
                    console.warn('TTS failed:', ttsErr);
                }
            }
        } catch (error) {
            console.error('AI Error:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI. Hãy thử lại sau!';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-consultant-page">
            <div className="ai-container container">
                {/* Sidebar */}
                <aside className="ai-sidebar">
                    <div className="sidebar-section">
                        <h3>Khám phá</h3>
                        <div className="suggestion-chips">
                            {suggestions.map((s, i) => (
                                <motion.div
                                    key={i}
                                    className="chip"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSend(s)}
                                >
                                    {s}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Dịch vụ</h3>
                        <div className="service-info">
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>
                                Nhân viên ảo Alibaba Food luôn sẵn sàng tư vấn món ăn phù hợp nhất với khẩu vị của bạn 24/7.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ai-main-content">
                    <div className="ai-chat-box">
                        <header className="ai-chat-header">
                            <div className="header-info">
                                <h2>Alibaba Virtual Assistant</h2>
                                <div className="status-indicator">
                                    <span className="dot"></span>
                                    <span>Đang trực tuyến</span>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button className="icon-btn" title="Clear Chat" onClick={() => setMessages([messages[0]])}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none">
                                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </header>

                        <div className="messages-list" ref={messagesListRef}>
                            <AnimatePresence initial={false}>
                                {messages.map(msg => (
                                    <motion.div
                                        key={msg.id}
                                        className={`message-item ${msg.sender}`}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="message-bubble">
                                            <div className="message-text">{msg.text}</div>

                                            {msg.recommendations && msg.recommendations.length > 0 && (
                                                <div className="food-recommendations">
                                                    {msg.recommendations.map((food, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            className="rec-food-card"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.1 * idx }}
                                                        >
                                                            <div className="rec-food-image">
                                                                <img src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={food.name} />
                                                            </div>
                                                            <div className="rec-food-info">
                                                                <h4>{food.name}</h4>
                                                                <p>{food.description}</p>
                                                                <div className="rec-meta">
                                                                    <span className="rec-price">{food.priceRange}</span>
                                                                    <span className="rec-match">{food.matchScore}% Match</span>
                                                                </div>
                                                                <a
                                                                    href={food.orderLink || '/menu'}
                                                                    className="order-btn"
                                                                    onClick={(e) => {
                                                                        if (food.orderLink && food.orderLink.startsWith('/menu#')) {
                                                                            // Handle hash navigation if needed
                                                                        }
                                                                    }}
                                                                >
                                                                    Mua ngay
                                                                </a>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {loading && (
                                <motion.div
                                    className="message-item ai"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="message-bubble loading">
                                        <div className="typing-dots">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="ai-input-wrapper">
                            <form className="ai-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                                <input
                                    type="text"
                                    placeholder="Tôi có thể giúp gì cho bạn hôm nay?"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={loading}
                                />
                                <button type="submit" disabled={loading || !input.trim()}>
                                    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AIConsultant;
