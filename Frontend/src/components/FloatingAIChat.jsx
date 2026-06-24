import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Bot, Minus, Sparkles } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import './FloatingAIChat.css';

const FloatingAIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Xin chào! Tôi là trợ lý ảo Alibaba Food. Hôm nay bạn muốn tìm món ăn như thế nào? Tôi có thể gợi ý món ngon phù hợp với bạn!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const quickPrompts = [
        "Gợi ý món cay tê lưỡi",
        "Thực đơn healthy ăn kiêng",
        "Burger nào ngon nhất?",
        "Combo ăn cùng bạn bè"
    ];

    // Show tooltip after 3 seconds on mount, then hide it after 8 seconds
    useEffect(() => {
        const timerShow = setTimeout(() => {
            if (!isOpen) setShowTooltip(true);
        }, 3000);

        const timerHide = setTimeout(() => {
            setShowTooltip(false);
        }, 11000);

        return () => {
            clearTimeout(timerShow);
            clearTimeout(timerHide);
        };
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, loading]);

    const handleSend = async (textToSend = input) => {
        if (!textToSend.trim() || loading) return;

        const userMsg = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/ai/consult', {
                question: textToSend,
                dietaryPreferences: "",
                allergies: "",
                includeVoiceResponse: false
            });

            if (response.data) {
                const aiResponseText = response.data.textResponse || response.data.message || "Xin lỗi, tôi chưa rõ ý bạn. Bạn có thể nói rõ hơn không?";
                const aiMsg = {
                    id: Date.now() + 1,
                    text: aiResponseText,
                    sender: 'ai',
                    recommendations: response.data.recommendations || response.data.foodSuggestions
                };
                setMessages(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error("AI Floating chat error:", error);
            const errMsg = error.response?.data?.message || "Có lỗi kết nối với trợ lý ảo. Hãy thử lại sau nhé!";
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: errMsg,
                sender: 'ai'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleFoodCardClick = (link) => {
        setIsOpen(false);
        if (link) {
            navigate(link);
            // If it's a hash link, scroll to it
            if (link.includes('#')) {
                const hash = link.split('#')[1];
                setTimeout(() => {
                    const el = document.getElementById(hash);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
            }
        }
    };

    return (
        <div className="floating-ai-chat-container">
            {/* Tooltip Welcome Banner */}
            <AnimatePresence>
                {showTooltip && !isOpen && (
                    <motion.div 
                        className="chat-welcome-tooltip"
                        initial={{ opacity: 0, y: 15, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        onClick={() => { setIsOpen(true); setShowTooltip(false); }}
                    >
                        <div className="tooltip-header">
                            <Sparkles size={14} className="sparkle-icon" />
                            <span>Alibaba AI gợi ý món ăn</span>
                        </div>
                        <p>Hôm nay bạn ăn gì? Để tôi tư vấn nhé! 🍔</p>
                        <div className="tooltip-arrow"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Trigger Button */}
            <motion.button
                className={`floating-ai-btn ${isOpen ? 'active' : ''}`}
                onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                layout
            >
                {isOpen ? <X size={26} /> : <Bot size={28} className="bot-pulse-icon" />}
                {!isOpen && <span className="online-indicator"></span>}
            </motion.button>

            {/* Chatbox Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="floating-ai-window"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.92 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    >
                        {/* Header */}
                        <div className="chat-window-header">
                            <div className="chat-header-avatar">
                                <div className="avatar-bg">
                                    <Bot size={20} className="header-bot-icon" />
                                </div>
                                <span className="status-dot"></span>
                            </div>
                            <div className="chat-header-title">
                                <h4>Alibaba AI Assistant</h4>
                                <span className="status-text">Đang trực tuyến</span>
                            </div>
                            <div className="chat-header-actions">
                                <button className="minimize-btn" onClick={() => setIsOpen(false)}>
                                    <Minus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="chat-window-body">
                            <div className="chat-messages-container">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                                        <div className="chat-message-bubble">
                                            <p className="message-content-text">{msg.text}</p>
                                            
                                            {/* Recommendations Inline */}
                                            {msg.recommendations && msg.recommendations.length > 0 && (
                                                <div className="inline-recommendations-list">
                                                    {msg.recommendations.map((food, index) => (
                                                        <div 
                                                            key={index} 
                                                            className="inline-food-card"
                                                            onClick={() => handleFoodCardClick(food.orderLink)}
                                                        >
                                                            <div className="inline-food-img">
                                                                <img src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} alt={food.name} />
                                                            </div>
                                                            <div className="inline-food-details">
                                                                <h5>{food.name}</h5>
                                                                <div className="inline-food-meta">
                                                                    <span className="food-price">{food.priceRange}</span>
                                                                    <span className="food-score">{food.matchScore}% Match</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="chat-message-row ai">
                                        <div className="chat-message-bubble loading-bubble">
                                            <div className="typing-loader">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Suggestions Chips & Input Wrapper */}
                        <div className="chat-window-footer">
                            {/* Suggestions */}
                            {messages.length === 1 && !loading && (
                                <div className="quick-suggestions">
                                    {quickPrompts.map((prompt, index) => (
                                        <button
                                            key={index}
                                            className="suggestion-chip"
                                            onClick={() => handleSend(prompt)}
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input Form */}
                            <form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                                <input
                                    type="text"
                                    placeholder="Hỏi Alibaba AI món ăn ngon..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={loading}
                                />
                                <button type="submit" className="chat-send-btn" disabled={!input.trim() || loading}>
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingAIChat;
