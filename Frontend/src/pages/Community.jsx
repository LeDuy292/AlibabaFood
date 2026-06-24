import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Heart, Share2, Send, Award, Trash2, 
    AlertTriangle, ShieldAlert, CheckCircle2, User, Star, 
    ThumbsUp, HelpCircle, FileText, ChevronRight, PenTool
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Community.css';

const Community = () => {
    const getAvatarUrl = (avatarUrl, name, size = 100) => {
        // Clear common null/empty values
        const cleanUrl = avatarUrl && avatarUrl !== 'null' && avatarUrl !== 'NULL' && avatarUrl !== 'undefined' ? avatarUrl : null;
        if (cleanUrl) return cleanUrl;

        // Generate initials from name
        const cleanName = name || 'User';
        const initials = cleanName
            .split(' ')
            .filter(Boolean)
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

        // Premium HSL-based hex colors for random avatar backgrounds
        const colors = [
            '#30d158', // Green
            '#ff9f0a', // Orange
            '#0a84ff', // Blue
            '#bf5af2', // Purple
            '#ff453a', // Red
            '#64d2ff', // Teal
            '#ffd60a', // Yellow
            '#ff375f', // Pink
            '#30b0c7'  // Cyan
        ];
        
        let hash = 0;
        for (let i = 0; i < cleanName.length; i++) {
            hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colorIndex = Math.abs(hash) % colors.length;
        const bgColor = colors[colorIndex];

        // Inline SVG template encoded as Data URL for lightweight, zero-request avatars
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                <rect width="100%" height="100%" fill="${bgColor}"/>
                <text x="50%" y="54%" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" font-size="${size * 0.4}px" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
                    ${initials}
                </text>
            </svg>
        `.trim();

        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    };

    const [activeTab, setActiveTab] = useState('feed'); // feed, review, feedback, report, profile
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    
    // Dynamic Stats loaded from Database
    const [stats, setStats] = useState({
        userStats: { totalOrders: 0, totalFoodSavedKg: 0, totalDiscountSaved: 0, carbonFootprintSavedKg: 0 },
        topSavers: [],
        systemStats: { totalFoodSavedKg: 0, carbonFootprintSavedKg: 0 }
    });

    // Form states
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImg, setPostImg] = useState('');
    
    const [commentInput, setCommentInput] = useState({}); // postId -> comment text

    // Review Form states
    const [reviewType, setReviewType] = useState('product'); // product or supplier
    const [selectedItem, setSelectedItem] = useState(''); // food item id
    const [selectedSupplier, setSelectedSupplier] = useState(''); // supplier id
    const [productRating, setProductRating] = useState(5);
    const [supplierRatingFood, setSupplierRatingFood] = useState(5);
    const [supplierRatingAccuracy, setSupplierRatingAccuracy] = useState(5);
    const [supplierRatingService, setSupplierRatingService] = useState(5);
    const [supplierRatingSpeed, setSupplierRatingSpeed] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    // Feedback Form states
    const [feedbackType, setFeedbackType] = useState('feature');
    const [feedbackTitle, setFeedbackTitle] = useState('');
    const [feedbackDesc, setFeedbackDesc] = useState('');

    // Report Form states
    const [reportType, setReportType] = useState('incorrect_info');
    const [reportSupplier, setReportSupplier] = useState('');
    const [reportItem, setReportItem] = useState('');
    const [reportDesc, setReportDesc] = useState('');

    // Dynamic Lists loaded from Database API
    const [dbFoodItems, setDbFoodItems] = useState([]);
    const [dbSuppliers, setDbSuppliers] = useState([]);

    // Load active user and data
    useEffect(() => {
        let userId = null;
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setCurrentUser(u);
                userId = u.UserId || u.userId || u.id;
            }
        } catch (e) {
            console.warn("Storage access failed");
        }

        // Fetch fresh user profile from backend to correct any cached data (e.g. name repair, avatar update)
        const token = localStorage.getItem("token");
        if (token) {
            api.get('/auth/me')
                .then(res => {
                    if (res.data && res.data.success) {
                        const freshUser = res.data.data;
                        setCurrentUser(freshUser);
                        localStorage.setItem("user", JSON.stringify(freshUser));
                    }
                })
                .catch(err => {
                    console.warn("Failed to fetch fresh user profile:", err);
                });
        }

        fetchPosts();
        fetchStats(userId);
        if (activeTab === 'feedback') {
            fetchFeedbacks();
        }
    }, [activeTab]); // Refresh statistics on tab change to show updated values

    useEffect(() => {
        fetchSuppliersAndProducts();
    }, []);

    const fetchSuppliersAndProducts = async () => {
        try {
            const [suppliersRes, productsRes] = await Promise.all([
                api.get('/community/suppliers'),
                api.get('/community/products')
            ]);
            
            if (suppliersRes.data && suppliersRes.data.success) {
                setDbSuppliers(suppliersRes.data.data);
                if (suppliersRes.data.data.length > 0) {
                    setSelectedSupplier(suppliersRes.data.data[0].id.toString());
                    setReportSupplier(suppliersRes.data.data[0].id.toString());
                }
            }
            if (productsRes.data && productsRes.data.success) {
                setDbFoodItems(productsRes.data.data);
                if (productsRes.data.data.length > 0) {
                    setSelectedItem(productsRes.data.data[0].id.toString());
                }
            }
        } catch (err) {
            console.error("Error fetching suppliers and products:", err);
        }
    };

    const fetchFeedbacks = async () => {
        setLoadingFeedbacks(true);
        try {
            const response = await api.get('/community/feedback');
            if (response.data && response.data.success) {
                setFeedbacks(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
            toast.error("Không thể tải danh sách góp ý");
        } finally {
            setLoadingFeedbacks(false);
        }
    };

    const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
            const response = await api.get('/community/posts');
            if (response.data && response.data.success) {
                setPosts(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching community posts:", err);
            toast.error("Không thể tải bảng tin cộng đồng");
        } finally {
            setLoadingPosts(false);
        }
    };

    const fetchStats = async (userId) => {
        try {
            let url = '/community/stats';
            if (userId) {
                url += `?userId=${userId}`;
            }
            const response = await api.get(url);
            if (response.data && response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching community stats:", err);
        }
    };

    // Actions
    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/community/posts/${postId}/like`);
            if (response.data && response.data.success) {
                setPosts(prev => prev.map(post => 
                    post.postId === postId ? { ...post, likesCount: post.likesCount + 1 } : post
                ));
                toast.success("Đã thích bài viết!");
            }
        } catch (err) {
            toast.error("Không thể thích bài viết");
        }
    };

    const handleComment = async (postId) => {
        const text = commentInput[postId];
        if (!text || !text.trim()) return;

        try {
            const response = await api.post(`/community/posts/${postId}/comment`, {
                content: text
            });
            if (response.data && response.data.success) {
                toast.success("Bình luận thành công!");
                setCommentInput(prev => ({ ...prev, [postId]: '' }));
                fetchPosts(); // Reload posts to show new comments
            }
        } catch (err) {
            toast.error("Lỗi khi gửi bình luận");
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!postTitle.trim() || !postContent.trim()) {
            toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
            return;
        }

        try {
            const response = await api.post('/community/posts', {
                title: postTitle,
                content: postContent,
                imageUrl: postImg || null
            });

            if (response.data && response.data.success) {
                toast.success("Đăng bài viết thành công!");
                setPostTitle('');
                setPostContent('');
                setPostImg('');
                fetchPosts();
                fetchStats(currentUser?.UserId || currentUser?.userId || currentUser?.id);
            }
        } catch (err) {
            toast.error("Không thể đăng bài viết");
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) {
            toast.error("Vui lòng nhập nhận xét!");
            return;
        }

        try {
            let endpoint = '/community/reviews/product';
            let payload = {};

            if (reviewType === 'product') {
                payload = {
                    itemId: parseInt(selectedItem),
                    rating: productRating,
                    comment: reviewComment
                };
            } else {
                endpoint = '/community/reviews/supplier';
                payload = {
                    supplierId: parseInt(selectedSupplier),
                    ratingFood: supplierRatingFood,
                    ratingAccuracy: supplierRatingAccuracy,
                    ratingService: supplierRatingService,
                    ratingSpeed: supplierRatingSpeed,
                    comment: reviewComment
                };
            }

            const response = await api.post(endpoint, payload);
            if (response.data && response.data.success) {
                toast.success(response.data.message || "Gửi đánh giá thành công!");
                setReviewComment('');
                setActiveTab('feed');
                fetchPosts();
                fetchStats(currentUser?.UserId || currentUser?.userId || currentUser?.id);
            }
        } catch (err) {
            toast.error("Lỗi gửi đánh giá");
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!feedbackTitle.trim() || !feedbackDesc.trim()) {
            toast.error("Vui lòng nhập đầy đủ tiêu đề và chi tiết!");
            return;
        }

        try {
            const response = await api.post('/community/feedback', {
                feedbackType,
                title: feedbackTitle,
                description: feedbackDesc
            });

            if (response.data && response.data.success) {
                toast.success(response.data.message || "Gửi góp ý thành công!");
                setFeedbackTitle('');
                setFeedbackDesc('');
                fetchFeedbacks();
            }
        } catch (err) {
            toast.error("Lỗi khi gửi góp ý");
        }
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        if (!reportDesc.trim()) {
            toast.error("Vui lòng nhập chi tiết báo cáo!");
            return;
        }

        try {
            const response = await api.post('/community/report', {
                reportedSupplierId: parseInt(reportSupplier),
                reportedItemId: reportItem ? parseInt(reportItem) : null,
                reportType: reportType,
                description: reportDesc
            });

            if (response.data && response.data.success) {
                toast.success(response.data.message || "Báo cáo vi phạm thành công!");
                setReportDesc('');
                setReportItem('');
                setActiveTab('feed');
            }
        } catch (err) {
            toast.error("Lỗi khi gửi báo cáo");
        }
    };

    return (
        <div className="community-page">
            <div className="community-hero">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Cộng đồng Tiêu dùng Xanh
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Kết nối người dùng, chia sẻ trải nghiệm thực phẩm và lan tỏa hành trình giải cứu thức ăn thừa cùng Alibaba Food.
                    </motion.p>
                </div>
            </div>

            <div className="container community-main">
                {/* Tabs Navigation */}
                <div className="community-tabs">
                    {['feed', 'review', 'feedback', 'report', 'profile'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'feed' && <MessageSquare size={16} />}
                            {tab === 'review' && <Star size={16} />}
                            {tab === 'feedback' && <PenTool size={16} />}
                            {tab === 'report' && <AlertTriangle size={16} />}
                            {tab === 'profile' && <Award size={16} />}
                            <span className="tab-label">
                                {tab === 'feed' && 'Bảng tin'}
                                {tab === 'review' && 'Đánh giá'}
                                {tab === 'feedback' && 'Góp ý'}
                                {tab === 'report' && 'Báo cáo'}
                                {tab === 'profile' && 'Food Saver'}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="community-content-grid">
                    {/* Main Content Area */}
                    <div className="community-primary">
                        <AnimatePresence mode="wait">
                            {/* TAB: FEED */}
                            {activeTab === 'feed' && (
                                <motion.div
                                    key="feed-tab"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Create Post Form */}
                                    <div className="glass-card create-post-card">
                                        <div className="card-header">
                                            <div className="avatar-placeholder">
                                                <User size={18} />
                                            </div>
                                            <h3>Chia sẻ câu chuyện của bạn</h3>
                                        </div>
                                        <form onSubmit={handleCreatePost} className="create-post-form">
                                            <input 
                                                type="text" 
                                                placeholder="Tiêu đề câu chuyện hoặc deal hời..."
                                                value={postTitle}
                                                onChange={(e) => setPostTitle(e.target.value)}
                                                required
                                            />
                                            <textarea 
                                                placeholder="Hôm nay bạn giải cứu được món gì? Tiết kiệm được bao nhiêu? Chia sẻ cảm nhận tại đây nhé..."
                                                value={postContent}
                                                onChange={(e) => setPostContent(e.target.value)}
                                                required
                                            />
                                            <input 
                                                type="url" 
                                                placeholder="Đường dẫn ảnh thực phẩm (tùy chọn)..."
                                                value={postImg}
                                                onChange={(e) => setPostImg(e.target.value)}
                                            />
                                            <div className="form-actions">
                                                <button type="submit" className="btn-primary">
                                                    Đăng câu chuyện
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Posts List */}
                                    {loadingPosts ? (
                                        <div className="loading-spinner-container">
                                            <div className="spinner"></div>
                                            <p>Đang tải bảng tin...</p>
                                        </div>
                                    ) : posts.length === 0 ? (
                                        <div className="empty-state">
                                            <HelpCircle size={48} className="empty-icon" />
                                            <p>Chưa có bài viết nào trên bảng tin. Hãy là người đầu tiên chia sẻ!</p>
                                        </div>
                                    ) : (
                                        <div className="posts-list">
                                            {posts.map((post) => (
                                                <motion.div 
                                                    key={post.postId} 
                                                    className="glass-card post-card"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <div className="post-header">
                                                        <div className="post-author-avatar">
                                                            <img src={getAvatarUrl(post.avatarUrl, post.fullName || post.username, 100)} alt="Avatar" />
                                                        </div>
                                                        <div className="post-author-info">
                                                            <h4>{post.fullName}</h4>
                                                            <span>@{post.username} • {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                                        </div>
                                                    </div>

                                                    <div className="post-body">
                                                        <h3>{post.title}</h3>
                                                        <p>{post.content}</p>
                                                        {post.imageUrl && (
                                                            <div className="post-image">
                                                                <img src={post.imageUrl} alt={post.title} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="post-footer">
                                                        <button className="post-action-btn like" onClick={() => handleLike(post.postId)}>
                                                            <Heart size={16} />
                                                            <span>{post.likesCount} Thích</span>
                                                        </button>
                                                        <div className="post-action-btn">
                                                            <MessageSquare size={16} />
                                                            <span>{post.commentsCount} Bình luận</span>
                                                        </div>
                                                    </div>

                                                    {/* Comments Area */}
                                                    <div className="post-comments-section">
                                                        {post.comments && post.comments.length > 0 && (
                                                            <div className="comments-list">
                                                                {post.comments.map((comment) => (
                                                                    <div key={comment.commentId} className="comment-item">
                                                                        <strong>{comment.fullName}</strong>
                                                                        <p>{comment.content}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="add-comment-box">
                                                            <input 
                                                                type="text" 
                                                                placeholder="Viết bình luận..."
                                                                value={commentInput[post.postId] || ''}
                                                                onChange={(e) => setCommentInput({
                                                                    ...commentInput,
                                                                    [post.postId]: e.target.value
                                                                })}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleComment(post.postId);
                                                                }}
                                                            />
                                                            <button onClick={() => handleComment(post.postId)}>
                                                                <Send size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* TAB: REVIEW */}
                            {activeTab === 'review' && (
                                <motion.div
                                    key="review-tab"
                                    className="glass-card review-card-form"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                >
                                    <div className="section-title">
                                        <h2>Đánh giá giao dịch & sản phẩm</h2>
                                        <p>Đánh giá thực tế từ bạn sẽ giúp xây dựng cộng đồng Alibaba xanh và đáng tin cậy hơn.</p>
                                    </div>

                                    <div className="review-type-selector">
                                        <button 
                                            type="button" 
                                            className={`type-btn ${reviewType === 'product' ? 'active' : ''}`}
                                            onClick={() => setReviewType('product')}
                                        >
                                            Đánh giá Sản phẩm
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`type-btn ${reviewType === 'supplier' ? 'active' : ''}`}
                                            onClick={() => setReviewType('supplier')}
                                        >
                                            Đánh giá Cửa hàng
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmitReview} className="community-form">
                                        {reviewType === 'product' ? (
                                            <>
                                                <div className="form-group">
                                                    <label>Chọn sản phẩm đã mua</label>
                                                    <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                                                        {dbFoodItems.map(item => (
                                                            <option key={item.id} value={item.id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Điểm đánh giá chất lượng</label>
                                                    <div className="star-rating">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <Star 
                                                                key={star} 
                                                                size={24} 
                                                                className={star <= productRating ? 'star-icon active' : 'star-icon'}
                                                                onClick={() => setProductRating(star)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="form-group">
                                                    <label>Chọn cửa hàng</label>
                                                    <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                                                        {dbSuppliers.map(sup => (
                                                            <option key={sup.id} value={sup.id}>{sup.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="grid-2-cols">
                                                    <div className="form-group">
                                                        <label>Chất lượng đồ ăn</label>
                                                        <div className="star-rating">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star key={star} size={18} className={star <= supplierRatingFood ? 'star-icon active' : 'star-icon'} onClick={() => setSupplierRatingFood(star)} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Thông tin chính xác</label>
                                                        <div className="star-rating">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star key={star} size={18} className={star <= supplierRatingAccuracy ? 'star-icon active' : 'star-icon'} onClick={() => setSupplierRatingAccuracy(star)} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Thái độ phục vụ</label>
                                                        <div className="star-rating">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star key={star} size={18} className={star <= supplierRatingService ? 'star-icon active' : 'star-icon'} onClick={() => setSupplierRatingService(star)} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Tốc độ xử lý</label>
                                                        <div className="star-rating">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star key={star} size={18} className={star <= supplierRatingSpeed ? 'star-icon active' : 'star-icon'} onClick={() => setSupplierRatingSpeed(star)} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="form-group">
                                            <label>Ý kiến nhận xét chi tiết</label>
                                            <textarea 
                                                placeholder="Cảm nhận về hương vị, độ tươi ngon, chất lượng phục vụ,..."
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button type="submit" className="btn-primary">Gửi đánh giá</button>
                                    </form>
                                </motion.div>
                            )}

                            {/* TAB: FEEDBACK */}
                            {activeTab === 'feedback' && (
                                <motion.div
                                    key="feedback-tab"
                                    className="feedback-tab-container"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="feedback-grid">
                                        {/* Submission Form */}
                                        <div className="glass-card feedback-card-form">
                                            <div className="section-title">
                                                <h2>Gửi góp ý và Feedback</h2>
                                                <p>Đóng góp ý tưởng của bạn giúp Alibaba Food nâng cấp chất lượng ứng dụng và cải thiện dịch vụ hàng ngày.</p>
                                            </div>

                                            <form onSubmit={handleSubmitFeedback} className="community-form">
                                                <div className="form-group">
                                                    <label>Loại góp ý</label>
                                                    <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
                                                        <option value="feature">Góp ý tính năng mới</option>
                                                        <option value="bug">Báo lỗi hệ thống</option>
                                                        <option value="ui">Cải tiến giao diện UI/UX</option>
                                                        <option value="promo">Đề xuất khuyến mãi</option>
                                                        <option value="other">Ý kiến khác</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Tiêu đề góp ý</label>
                                                    <input 
                                                        type="text"
                                                        placeholder="Tóm tắt ngắn gọn góp ý của bạn..."
                                                        value={feedbackTitle}
                                                        onChange={(e) => setFeedbackTitle(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Mô tả chi tiết</label>
                                                    <textarea 
                                                        placeholder="Mô tả cụ thể ý tưởng của bạn, hoặc các khó khăn gặp phải khi sử dụng ứng dụng..."
                                                        value={feedbackDesc}
                                                        onChange={(e) => setFeedbackDesc(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <button type="submit" className="btn-primary">Gửi phản hồi</button>
                                            </form>
                                        </div>

                                        {/* Feedbacks List */}
                                        <div className="glass-card feedbacks-list-card">
                                            <div className="section-title">
                                                <h2>Ý kiến đóng góp từ các User</h2>
                                                <p>Các ý kiến đóng góp được chia sẻ công khai và ghi nhận bởi Alibaba Food.</p>
                                            </div>

                                            {loadingFeedbacks ? (
                                                <div className="loading-spinner-container">
                                                    <div className="spinner"></div>
                                                    <p>Đang tải góp ý...</p>
                                                </div>
                                            ) : feedbacks.length === 0 ? (
                                                <div className="empty-state" style={{ padding: '40px 0' }}>
                                                    <HelpCircle size={40} className="empty-icon" />
                                                    <p>Chưa có ý kiến đóng góp nào. Hãy là người đầu tiên góp ý!</p>
                                                </div>
                                            ) : (
                                                <div className="feedbacks-container">
                                                    {feedbacks.map((fb) => (
                                                        <div key={fb.feedbackId} className="feedback-item-card">
                                                            <div className="feedback-item-header">
                                                                <div className="feedback-user-info">
                                                                    <img 
                                                                        className="feedback-user-avatar" 
                                                                        src={getAvatarUrl(fb.avatarUrl, fb.fullName || fb.username, 100)} 
                                                                        alt={fb.fullName} 
                                                                    />
                                                                    <div className="feedback-user-details">
                                                                        <h5>{fb.fullName}</h5>
                                                                        <span>@{fb.username} • {new Date(fb.createdAt).toLocaleDateString('vi-VN')}</span>
                                                                    </div>
                                                                </div>
                                                                <span className={`feedback-type-badge ${fb.feedbackType}`}>
                                                                    {fb.feedbackType === 'feature' && 'Tính năng'}
                                                                    {fb.feedbackType === 'bug' && 'Báo lỗi'}
                                                                    {fb.feedbackType === 'ui' && 'Giao diện'}
                                                                    {fb.feedbackType === 'promo' && 'Ưu đãi'}
                                                                    {fb.feedbackType === 'other' && 'Khác'}
                                                                </span>
                                                            </div>
                                                            <div className="feedback-item-body">
                                                                <h4>{fb.title}</h4>
                                                                <p>{fb.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: REPORT */}
                            {activeTab === 'report' && (
                                <motion.div
                                    key="report-tab"
                                    className="glass-card report-card-form"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                >
                                    <div className="section-title text-danger">
                                        <h2>Báo cáo vi phạm cửa hàng</h2>
                                        <p>Hệ thống tiếp nhận các phản ánh về chất lượng thực phẩm, hành vi gian lận hoặc sai lệch thông tin cửa hàng.</p>
                                    </div>

                                    <form onSubmit={handleSubmitReport} className="community-form">
                                        <div className="form-group">
                                            <label>Loại vi phạm</label>
                                            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                                <option value="incorrect_info">Thông tin sai lệch</option>
                                                <option value="wrong_image">Hình ảnh không thực tế</option>
                                                <option value="bad_quality">Thực phẩm kém chất lượng</option>
                                                <option value="fraud">Hành vi gian lận</option>
                                                <option value="other">Lý do khác</option>
                                            </select>
                                        </div>

                                        <div className="grid-2-cols">
                                            <div className="form-group">
                                                <label>Cửa hàng vi phạm</label>
                                                <select value={reportSupplier} onChange={(e) => setReportSupplier(e.target.value)}>
                                                    {dbSuppliers.map(sup => (
                                                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Sản phẩm liên quan (tùy chọn)</label>
                                                <select value={reportItem} onChange={(e) => setReportItem(e.target.value)}>
                                                    <option value="">-- Không có --</option>
                                                    {dbFoodItems.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Chi tiết báo cáo vi phạm</label>
                                            <textarea 
                                                placeholder="Mô tả cụ thể sự việc vi phạm để ban quản trị tiến hành đối chiếu và kiểm tra xử lý..."
                                                value={reportDesc}
                                                onChange={(e) => setReportDesc(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button type="submit" className="btn-primary btn-danger">Gửi báo cáo</button>
                                    </form>
                                </motion.div>
                            )}

                            {/* TAB: PROFILE */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile-tab"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                >
                                    <div className="saver-profile-hero">
                                        <div className="saver-avatar">
                                            <img src={getAvatarUrl(currentUser?.AvatarUrl || currentUser?.avatarUrl, currentUser?.FullName || currentUser?.fullName || currentUser?.username, 150)} alt="Saver Avatar" />
                                            <div className="rank-badge">Tier 2</div>
                                        </div>
                                        <div className="saver-intro">
                                            <h2>{currentUser?.FullName || currentUser?.fullName || 'Người cứu hộ thực phẩm'}</h2>
                                            <p>Thành viên tiêu dùng xanh từ: {currentUser ? new Date().toLocaleDateString('vi-VN') : 'Tháng 6/2026'}</p>
                                        </div>
                                    </div>

                                    {/* Stats Bento Grid (Dynamic from Database) */}
                                    <div className="saver-stats-grid">
                                        <div className="stat-item green-glow">
                                            <CheckCircle2 className="stat-icon text-green" />
                                            <div className="stat-val">{stats.userStats.totalOrders}</div>
                                            <div className="stat-label">Số đơn đã thực hiện</div>
                                        </div>
                                        <div className="stat-item orange-glow">
                                            <Award className="stat-icon text-orange" />
                                            <div className="stat-val">{stats.userStats.totalFoodSavedKg.toLocaleString('vi-VN')} kg</div>
                                            <div className="stat-label">Thực phẩm đã giải cứu</div>
                                        </div>
                                        <div className="stat-item blue-glow">
                                            <ThumbsUp className="stat-icon text-blue" />
                                            <div className="stat-val">{stats.userStats.totalDiscountSaved.toLocaleString('vi-VN')}đ</div>
                                            <div className="stat-label">Tổng số tiền tiết kiệm</div>
                                        </div>
                                    </div>

                                    {/* Badges Section */}
                                    <div className="glass-card badges-section">
                                        <h3>Huy hiệu thành tích đạt được</h3>
                                        <div className="badges-grid">
                                            <div className="badge-card active">
                                                <div className="badge-icon green">🌱</div>
                                                <h4>Mầm Non Xanh</h4>
                                                <p>Thực hiện đơn hàng giải cứu đầu tiên thành công.</p>
                                            </div>
                                            <div className="badge-card active">
                                                <div className="badge-icon orange">🛡️</div>
                                                <h4>Giải Cứu Binh Nhì</h4>
                                                <p>Giải cứu thành công trên 3kg thực phẩm khỏi lãng phí.</p>
                                            </div>
                                            <div className="badge-card locked">
                                                <div className="badge-icon gray">⚔️</div>
                                                <h4>Hiệp Sĩ Môi Trường</h4>
                                                <p>Khóa: Đạt thành tích cứu trợ 10kg thực phẩm.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Area */}
                    <aside className="community-sidebar">
                        {/* Environmental Impact Widgets (Dynamic from Database) */}
                        <div className="glass-card impact-widget">
                            <h3 className="widget-title">Tác động cộng đồng</h3>
                            <div className="impact-indicator">
                                <div className="indicator-circle">
                                    <span className="number">{stats.systemStats.totalFoodSavedKg.toLocaleString('vi-VN')}</span>
                                    <span className="unit">kg</span>
                                </div>
                                <div className="indicator-desc">
                                    <h4>Thực phẩm được cứu trợ</h4>
                                    <p>Tổng khối lượng thực phẩm thừa được bán ưu đãi thay vì bị thải bỏ.</p>
                                </div>
                            </div>
                            <div className="impact-indicator">
                                <div className="indicator-circle co2">
                                    <span className="number">{(stats.systemStats.carbonFootprintSavedKg / 1000).toFixed(1)}</span>
                                    <span className="unit">tấn</span>
                                </div>
                                <div className="indicator-desc">
                                    <h4>Giảm thiểu CO2</h4>
                                    <p>Giảm thiểu phát thải khí nhà kính tương đương khi ngăn thức ăn phân hủy.</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Food Savers list (Dynamic from Database) */}
                        {stats.topSavers && stats.topSavers.length > 0 && (
                            <div className="glass-card leaderboard-widget">
                                <h3 className="widget-title">Food Savers Hàng Đầu</h3>
                                <div className="leaderboard-list">
                                    {stats.topSavers.map((saver, idx) => (
                                        <div key={idx} className="leaderboard-item">
                                            <span className="rank">{saver.rank}</span>
                                            <img src={getAvatarUrl(saver.avatarUrl, saver.fullName, 50)} alt="Saver avatar" />
                                            <div className="saver-details">
                                                <h5>{saver.fullName}</h5>
                                                <p>Đã cứu: {saver.totalFoodSavedKg.toLocaleString('vi-VN')} kg</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Community;
