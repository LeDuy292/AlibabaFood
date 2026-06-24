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
    
    // Filters State
    const [dietary, setDietary] = useState('');
    const [allergy, setAllergy] = useState('');
    const [budget, setBudget] = useState('');
    
    // Audio Player State
    const [playingId, setPlayingId] = useState(null);
    const [audioLoadingId, setAudioLoadingId] = useState(null);
    const audioRef = useRef(null);
    
    // Expanded Suggestion Card State
    const [expandedCardKey, setExpandedCardKey] = useState(null); // format: `${messageId}-${index}`

    const messagesListRef = useRef(null);

    const quickPrompts = [
        { label: "Món ăn healthy", query: "Gợi ý các món ăn healthy tốt cho sức khỏe" },
        { label: "Bữa sáng nhẹ nhàng", query: "Tôi muốn tìm món ăn sáng nhẹ nhàng, dễ tiêu hóa" },
        { label: "Bữa tối ấm cúng", query: "Đề xuất món ngon cho bữa tối gia đình" },
        { label: "Đặc sản Việt Nam", query: "Có những đặc sản Việt Nam nào ngon?" },
        { label: "Món ăn cay nồng", query: "Tôi thích ăn cay, gợi ý món ăn kích thích vị giác" }
    ];

    const scrollToBottom = (force = false) => {
        const container = messagesListRef.current;
        if (!container) return;

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
        scrollToBottom(lastMessage?.sender === 'user');
    }, [messages]);

    // Also scroll when loading state changes (dots appear/disappear)
    useEffect(() => {
        if (loading) {
            scrollToBottom(true);
        }
    }, [loading]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const handleSend = async (messageText = input) => {
        if (!messageText.trim() || loading) return;

        const userMessage = { id: Date.now(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/ai/consult', {
                question: messageText,
                dietaryPreferences: dietary,
                allergies: allergy,
                budget: budget,
                includeVoiceResponse: false // Managed manually to reduce latency and load
            });

            if (response.data) {
                const aiResponseText = response.data.textResponse || response.data.message;

                const aiResponse = {
                    id: Date.now() + 1,
                    text: aiResponseText,
                    sender: 'ai',
                    recommendations: response.data.recommendations || response.data.foodSuggestions || []
                };
                setMessages(prev => [...prev, aiResponse]);
            }
        } catch (error) {
            console.error('AI Error:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI. Hãy thử lại sau!';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Audio Play / Pause handler
    const handlePlayAudio = async (msgId, text) => {
        if (playingId === msgId) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setPlayingId(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // Check if message already has base64 cached
        const msgIndex = messages.findIndex(m => m.id === msgId);
        if (msgIndex === -1) return;

        const message = messages[msgIndex];

        if (message.audioBase64) {
            playAudioFromBase64(msgId, message.audioBase64);
        } else {
            setAudioLoadingId(msgId);
            try {
                // Fetch TTS from backend
                const response = await api.post('/ai/tts', { text });
                if (response.data && response.data.audioBase64) {
                    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, audioBase64: response.data.audioBase64 } : m));
                    playAudioFromBase64(msgId, response.data.audioBase64);
                } else {
                    toast.error("Không thể tải giọng nói");
                }
            } catch (err) {
                console.error("TTS failed:", err);
                toast.error("Lỗi kết nối dịch vụ giọng nói");
            } finally {
                setAudioLoadingId(null);
            }
        }
    };

    const playAudioFromBase64 = (msgId, base64) => {
        const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
        audioRef.current = audio;
        setPlayingId(msgId);

        audio.play().catch(e => {
            console.warn('Audio play failed:', e);
            setPlayingId(null);
        });

        audio.onended = () => {
            setPlayingId(null);
            audioRef.current = null;
        };
    };

    const clearChat = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPlayingId(null);
        setMessages([messages[0]]);
        setExpandedCardKey(null);
    };

    const toggleExpandCard = (key) => {
        setExpandedCardKey(prev => prev === key ? null : key);
        setTimeout(() => scrollToBottom(false), 100);
    };

    return (
        <div className="ai-consultant-page">
            <div className="ai-container container">
                {/* Sidebar with Advanced Filters */}
                <aside className="ai-sidebar">
                    <div className="sidebar-section">
                        <h3>Bộ lọc khẩu vị</h3>
                        
                        {/* Dietary Preferences */}
                        <div className="filter-group">
                            <label className="filter-label">Chế độ dinh dưỡng</label>
                            <div className="filter-options">
                                {[
                                    { value: '', label: 'Tất cả' },
                                    { value: 'healthy', label: '🥗 Healthy' },
                                    { value: 'vegan', label: '🥦 Ăn chay' },
                                    { value: 'high-protein', label: '🥩 Nhiều đạm' },
                                    { value: 'low-carb', label: '🍳 Ít tinh bột' }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`filter-btn ${dietary === opt.value ? 'active' : ''}`}
                                        onClick={() => setDietary(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Allergies */}
                        <div className="filter-group">
                            <label className="filter-label">Tránh dị ứng</label>
                            <div className="filter-options">
                                {[
                                    { value: '', label: 'Không dị ứng' },
                                    { value: 'seafood', label: '🦐 Hải sản' },
                                    { value: 'peanuts', label: '🥜 Đậu phộng' },
                                    { value: 'dairy', label: '🥛 Sữa' }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`filter-btn ${allergy === opt.value ? 'active' : ''}`}
                                        onClick={() => setAllergy(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="filter-group">
                            <label className="filter-label">Ngân sách tối đa</label>
                            <div className="filter-options">
                                {[
                                    { value: '', label: 'Tự do' },
                                    { value: 'under-50k', label: '💰 < 50k' },
                                    { value: '50k-100k', label: '💳 50k - 100k' },
                                    { value: 'over-100k', label: '💎 > 100k' }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`filter-btn ${budget === opt.value ? 'active' : ''}`}
                                        onClick={() => setBudget(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Gợi ý nhanh</h3>
                        <div className="quick-prompt-list">
                            {quickPrompts.map((item, i) => (
                                <motion.button
                                    key={i}
                                    className="quick-prompt-item"
                                    whileHover={{ x: 5 }}
                                    onClick={() => handleSend(item.query)}
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ai-main-content">
                    <div className="ai-chat-box">
                        <header className="ai-chat-header">
                            <div className="header-info">
                                <h2>Trợ lý Dinh dưỡng Alibaba</h2>
                                <div className="status-indicator">
                                    <span className="dot"></span>
                                    <span>Đang trực tuyến</span>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button className="icon-btn" title="Xóa hội thoại" onClick={clearChat}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
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
                                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
                                    >
                                        <div className="message-wrapper">
                                            <div className="message-bubble">
                                                <div className="message-text">{msg.text}</div>
                                                
                                                {/* Text To Speech Control */}
                                                {msg.sender === 'ai' && (
                                                    <button 
                                                        className={`tts-control-btn ${playingId === msg.id ? 'playing' : ''} ${audioLoadingId === msg.id ? 'loading' : ''}`}
                                                        onClick={() => handlePlayAudio(msg.id, msg.text)}
                                                        disabled={audioLoadingId === msg.id}
                                                        title="Nghe tư vấn giọng nói"
                                                    >
                                                        {audioLoadingId === msg.id ? (
                                                            <span className="tts-spinner"></span>
                                                        ) : playingId === msg.id ? (
                                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                                                                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                                                            </svg>
                                                        ) : (
                                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                                                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                                            </svg>
                                                        )}
                                                        <span>{playingId === msg.id ? 'Đang phát' : audioLoadingId === msg.id ? 'Đang tải...' : 'Nghe tư vấn'}</span>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Recommendations Grid */}
                                            {msg.recommendations && msg.recommendations.length > 0 && (
                                                <div className="food-recommendations">
                                                    {msg.recommendations.map((food, idx) => {
                                                        const cardKey = `${msg.id}-${idx}`;
                                                        const isExpanded = expandedCardKey === cardKey;
                                                        
                                                        return (
                                                            <motion.div
                                                                key={idx}
                                                                className="rec-food-card"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.1 * idx }}
                                                            >
                                                                <div className="rec-food-image">
                                                                    <img src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={food.name} />
                                                                    <span className="rec-match">{food.matchScore || 90}% khớp</span>
                                                                </div>
                                                                <div className="rec-food-info">
                                                                    <span className="rec-category">{food.category || 'Món ăn'}</span>
                                                                    <h4>{food.name}</h4>
                                                                    <p className="rec-desc">{food.description}</p>
                                                                    
                                                                    {/* Expandable Details Area */}
                                                                    <AnimatePresence>
                                                                        {isExpanded && (
                                                                            <motion.div 
                                                                                className="rec-details-panel"
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                transition={{ duration: 0.2 }}
                                                                            >
                                                                                {food.preparationTime && (
                                                                                    <div className="detail-item">
                                                                                        <strong>⏱️ Chuẩn bị:</strong> {food.preparationTime}
                                                                                    </div>
                                                                                )}
                                                                                {food.ingredients && food.ingredients.length > 0 && (
                                                                                    <div className="detail-item">
                                                                                        <strong>🥗 Thành phần:</strong> {food.ingredients.join(', ')}
                                                                                    </div>
                                                                                )}
                                                                                {food.benefits && food.benefits.length > 0 && (
                                                                                    <div className="detail-item">
                                                                                        <strong>🌟 Lợi ích:</strong> {food.benefits.join(', ')}
                                                                                    </div>
                                                                                )}
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>

                                                                    <div className="rec-meta">
                                                                        <span className="rec-price">{food.priceRange}</span>
                                                                        <button 
                                                                            className={`details-toggle ${isExpanded ? 'active' : ''}`}
                                                                            onClick={() => toggleExpandCard(cardKey)}
                                                                        >
                                                                            {isExpanded ? 'Ẩn bớt' : 'Chi tiết'}
                                                                        </button>
                                                                    </div>
                                                                    
                                                                    <a href={food.orderLink || '/menu'} className="order-btn">
                                                                        Đặt món ngay
                                                                    </a>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
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
                                    placeholder="Đặt câu hỏi về dinh dưỡng hoặc món ăn..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={loading}
                                />
                                <button type="submit" disabled={loading || !input.trim()}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
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
