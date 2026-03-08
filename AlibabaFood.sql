-- =====================================================
-- ALIBABA FOOD - DATABASE DESIGN (SQL SERVER)
-- Hệ thống kết nối cửa hàng với người tiêu dùng
-- để phân phối thực phẩm cuối ngày, giảm lãng phí
-- =====================================================

-- Create Database
CREATE DATABASE AlibabaFood;
GO

USE AlibabaFood;
GO

-- =====================================================
-- QUẢN LÝ NGƯỜI DÙNG (USERS MANAGEMENT)
-- =====================================================

-- Bảng vai trò người dùng
CREATE TABLE roles (
    role_id INT PRIMARY KEY IDENTITY(1,1),
    role_name VARCHAR(50) NOT NULL UNIQUE, -- 'customer', 'supplier', 'admin', 'moderator'
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng người dùng chính
CREATE TABLE users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role_id INT NOT NULL,
    is_verified BIT DEFAULT 0,
    is_active BIT DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Bảng địa chỉ người dùng
CREATE TABLE user_addresses (
    address_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    address_type VARCHAR(20), -- 'home', 'work', 'other'
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng thông báo người dùng
CREATE TABLE user_notifications (
    notification_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50), -- 'order', 'system', 'promotion', 'community'
    is_read BIT DEFAULT 0,
    related_id INT, -- ID của đơn hàng, bài viết, etc.
    related_type VARCHAR(50), -- 'order', 'post', 'review', etc.
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================================================
-- QUẢN LÝ NHÀ CUNG CẤP (SUPPLIER MANAGEMENT)
-- =====================================================

-- Bảng loại hình kinh doanh
CREATE TABLE business_types (
    business_type_id INT PRIMARY KEY IDENTITY(1,1),
    type_name VARCHAR(100) NOT NULL UNIQUE, -- 'restaurant', 'cafe', 'supermarket', 'bakery'
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng nhà cung cấp/cửa hàng
CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    business_type_id INT NOT NULL,
    business_registration_number VARCHAR(100), -- Mã số kinh doanh
    tax_code VARCHAR(50),
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    description TEXT,
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),
    opening_time TIME,
    closing_time TIME,
    is_verified BIT DEFAULT 0,
    verification_date DATETIME,
    is_active BIT DEFAULT 1,
    rating_average DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (business_type_id) REFERENCES business_types(business_type_id)
);

-- Bảng giờ hoạt động đặc biệt của cửa hàng
CREATE TABLE supplier_special_hours (
    special_hour_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    date DATE NOT NULL,
    opening_time TIME,
    closing_time TIME,
    is_closed BIT DEFAULT 0,
    reason VARCHAR(255), -- 'holiday', 'maintenance', 'special_event'
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

-- Bảng tài liệu xác minh nhà cung cấp
CREATE TABLE supplier_verification_documents (
    document_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'business_license', 'food_safety_cert', 'tax_cert'
    document_url VARCHAR(500) NOT NULL,
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    verified_by INT,
    verified_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(user_id)
);

-- Bảng vi phạm của nhà cung cấp
CREATE TABLE supplier_violations (
    violation_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    violation_type VARCHAR(50) NOT NULL, -- 'false_info', 'expired_food', 'quality_issue'
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'minor', 'moderate', 'severe', 'critical'
    reported_by INT,
    related_order_id INT,
    action_taken VARCHAR(50), -- 'warning', 'temporary_ban', 'permanent_ban'
    ban_start_date DATETIME,
    ban_end_date DATETIME,
    is_resolved BIT DEFAULT 0,
    resolved_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(user_id)
);

-- =====================================================
-- QUẢN LÝ DANH MỤC THỰC PHẨM (FOOD CATEGORIES)
-- =====================================================

-- Bảng danh mục thực phẩm
CREATE TABLE food_categories (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    parent_category_id INT,
    category_name VARCHAR(100) NOT NULL,
    category_name_en VARCHAR(100),
    description TEXT,
    icon_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
);

-- Bảng nhu cầu ăn uống (dietary preferences)
CREATE TABLE dietary_preferences (
    preference_id INT PRIMARY KEY IDENTITY(1,1),
    preference_name VARCHAR(100) NOT NULL UNIQUE, -- 'vegetarian', 'vegan', 'halal', 'gluten_free'
    description TEXT,
    icon_url VARCHAR(500),
    created_at DATETIME DEFAULT GETDATE()
);

-- =====================================================
-- QUẢN LÝ SẢN PHẨM THỰC PHẨM (FOOD ITEMS)
-- =====================================================

-- Bảng loại sản phẩm
CREATE TABLE product_types (
    product_type_id INT PRIMARY KEY IDENTITY(1,1),
    type_name VARCHAR(50) NOT NULL UNIQUE, -- 'surprise_bag_cooked', 'surprise_bag_raw', 'specific_cooked', 'specific_raw'
    type_name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng trạng thái thực phẩm
CREATE TABLE food_statuses (
    status_id INT PRIMARY KEY IDENTITY(1,1),
    status_name VARCHAR(50) NOT NULL UNIQUE, -- 'hot', 'cold', 'fresh', 'frozen', 'packaged'
    status_name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    storage_instruction TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng sản phẩm thực phẩm
CREATE TABLE food_items (
    item_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    product_type_id INT NOT NULL,
    category_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_surprise_bag BIT DEFAULT 0,
    quantity_available INT NOT NULL DEFAULT 0,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    food_status_id INT NOT NULL,
    preparation_time DATETIME NOT NULL, -- Thời gian chế biến
    safe_consumption_time DATETIME NOT NULL, -- Thời gian sử dụng an toàn
    expiry_time DATETIME NOT NULL, -- Thời điểm hết hạn logic
    pickup_start_time DATETIME,
    pickup_end_time DATETIME,
    is_pre_order BIT DEFAULT 0,
    weight_kg DECIMAL(8, 3),
    calories INT,
    allergens TEXT, -- JSON array: ["milk", "eggs", "nuts"]
    ingredients TEXT,
    storage_instructions TEXT,
    reheating_instructions TEXT,
    is_active BIT DEFAULT 1,
    is_approved BIT DEFAULT 0,
    approved_by INT,
    approved_at DATETIME,
    total_sold INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (product_type_id) REFERENCES product_types(product_type_id),
    FOREIGN KEY (category_id) REFERENCES food_categories(category_id),
    FOREIGN KEY (food_status_id) REFERENCES food_statuses(status_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id),
    INDEX idx_supplier (supplier_id),
    INDEX idx_active_time (is_active, expiry_time),
    INDEX idx_category (category_id)
);

-- Bảng hình ảnh sản phẩm
CREATE TABLE food_item_images (
    image_id INT PRIMARY KEY IDENTITY(1,1),
    item_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BIT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE CASCADE
);

-- Bảng nhu cầu ăn uống của sản phẩm
CREATE TABLE food_item_dietary_preferences (
    item_id INT NOT NULL,
    preference_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (item_id, preference_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (preference_id) REFERENCES dietary_preferences(preference_id) ON DELETE CASCADE
);

-- Bảng lịch sử giá sản phẩm
CREATE TABLE food_item_price_history (
    history_id INT PRIMARY KEY IDENTITY(1,1),
    item_id INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    changed_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE CASCADE
);

-- =====================================================
-- QUẢN LÝ TÚI BẤT NGỜ (SURPRISE BAGS)
-- =====================================================

CREATE TABLE surprise_bags (
    bag_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    product_type_id INT NOT NULL, -- surprise_bag_cooked or surprise_bag_raw
    bag_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity_available INT NOT NULL DEFAULT 0,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    food_status_id INT NOT NULL,
    preparation_time DATETIME,
    safe_consumption_time DATETIME NOT NULL,
    expiry_time DATETIME NOT NULL,
    pickup_start_time DATETIME,
    pickup_end_time DATETIME,
    is_pre_order BIT DEFAULT 0,
    estimated_items_count INT, -- Ước tính số lượng món trong túi
    estimated_weight_kg DECIMAL(8, 3),
    includes_allergens TEXT, -- JSON array của các allergen có thể có
    includes_categories TEXT, -- JSON array các danh mục có trong túi
    storage_instructions TEXT,
    reheating_instructions TEXT,
    is_active BIT DEFAULT 1,
    is_approved BIT DEFAULT 0,
    approved_by INT,
    approved_at DATETIME,
    total_sold INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (product_type_id) REFERENCES product_types(product_type_id),
    FOREIGN KEY (food_status_id) REFERENCES food_statuses(status_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- Bảng hình ảnh túi bất ngờ
CREATE TABLE surprise_bag_images (
    image_id INT PRIMARY KEY IDENTITY(1,1),
    bag_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BIT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (bag_id) REFERENCES surprise_bags(bag_id) ON DELETE CASCADE
);

-- =====================================================
-- QUẢN LÝ YÊU THÍCH (FAVORITES)
-- =====================================================

-- Bảng yêu thích sản phẩm
CREATE TABLE favorite_items (
    favorite_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id, item_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE CASCADE
);

-- Bảng yêu thích cửa hàng
CREATE TABLE favorite_suppliers (
    favorite_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id, supplier_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- =====================================================
-- QUẢN LÝ GIỎ HÀNG (SHOPPING CART)
-- =====================================================

CREATE TABLE cart_items (
    cart_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    item_id INT, -- NULL nếu là túi bất ngờ
    bag_id INT, -- NULL nếu là sản phẩm thông thường
    quantity INT NOT NULL DEFAULT 1,
    added_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id, item_id, bag_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (bag_id) REFERENCES surprise_bags(bag_id) 
);

-- =====================================================
-- QUẢN LÝ ĐƠN HÀNG (ORDER MANAGEMENT)
-- =====================================================

-- Bảng trạng thái đơn hàng
CREATE TABLE order_statuses (
    status_id INT PRIMARY KEY IDENTITY(1,1),
    status_name VARCHAR(50) NOT NULL UNIQUE, -- 'pending', 'confirmed', 'ready', 'completed', 'cancelled'
    status_name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng đơn hàng
CREATE TABLE orders (
    order_id INT PRIMARY KEY IDENTITY(1,1),
    order_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    order_status_id INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- 'cash', 'card', 'momo', 'zalopay', 'bank_transfer'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    paid_at DATETIME,
    pickup_type VARCHAR(20) NOT NULL, -- 'self_pickup', 'delivery'
    pickup_time DATETIME,
    pickup_address TEXT,
    delivery_address_id INT,
    special_instructions TEXT,
    cancellation_reason TEXT,
    cancelled_by INT,
    cancelled_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (order_status_id) REFERENCES order_statuses(status_id),
    FOREIGN KEY (delivery_address_id) REFERENCES user_addresses(address_id),
    FOREIGN KEY (cancelled_by) REFERENCES users(user_id),
    INDEX idx_user_orders (user_id, created_at),
    INDEX idx_supplier_orders (supplier_id, created_at),
    INDEX idx_status (order_status_id)
);

-- Bảng chi tiết đơn hàng (cho sản phẩm thông thường)
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL, -- Lưu tên tại thời điểm đặt hàng
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    preparation_time DATETIME, -- Thời gian chế biến (lưu snapshot)
    safe_consumption_time DATETIME, -- Thời gian an toàn (lưu snapshot)
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id)
);

-- Bảng chi tiết đơn hàng (cho túi bất ngờ)
CREATE TABLE order_surprise_bags (
    order_bag_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    bag_id INT NOT NULL,
    bag_name VARCHAR(255) NOT NULL, -- Lưu tên tại thời điểm đặt hàng
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    preparation_time DATETIME,
    safe_consumption_time DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (bag_id) REFERENCES surprise_bags(bag_id)
);

-- Bảng lịch sử trạng thái đơn hàng
CREATE TABLE order_status_history (
    history_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    order_status_id INT NOT NULL,
    notes TEXT,
    changed_by INT,
    changed_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (order_status_id) REFERENCES order_statuses(status_id),
    FOREIGN KEY (changed_by) REFERENCES users(user_id)
);

-- =====================================================
-- QUẢN LÝ ĐÁNH GIÁ (REVIEWS & RATINGS)
-- =====================================================

-- Bảng đánh giá sản phẩm
CREATE TABLE item_reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    food_quality_rating INT CHECK (food_quality_rating BETWEEN 1 AND 5),
    freshness_rating INT CHECK (freshness_rating BETWEEN 1 AND 5),
    value_rating INT CHECK (value_rating BETWEEN 1 AND 5),
    is_verified_purchase BIT DEFAULT 1,
    helpful_count INT DEFAULT 0,
    is_visible BIT DEFAULT 1,
    is_flagged BIT DEFAULT 0,
    flagged_reason TEXT,
    response_from_supplier TEXT,
    response_at DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE (order_id, item_id, user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_item_reviews (item_id, is_visible)
);

-- Bảng đánh giá cửa hàng
CREATE TABLE supplier_reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    supplier_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    service_rating INT CHECK (service_rating BETWEEN 1 AND 5),
    packaging_rating INT CHECK (packaging_rating BETWEEN 1 AND 5),
    timeliness_rating INT CHECK (timeliness_rating BETWEEN 1 AND 5),
    is_verified_purchase BIT DEFAULT 1,
    helpful_count INT DEFAULT 0,
    is_visible BIT DEFAULT 1,
    is_flagged BIT DEFAULT 0,
    flagged_reason TEXT,
    response_from_supplier TEXT,
    response_at DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE (order_id, supplier_id, user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_supplier_reviews (supplier_id, is_visible)
);

-- Bảng hình ảnh đánh giá
CREATE TABLE review_images (
    image_id INT PRIMARY KEY IDENTITY(1,1),
    review_id INT NOT NULL,
    review_type VARCHAR(20) NOT NULL, -- 'item' hoặc 'supplier'
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (review_id) REFERENCES item_reviews(review_id) ON DELETE CASCADE
);

-- =====================================================
-- QUẢN LÝ CHAT/NHẮN TIN (MESSAGING)
-- =====================================================

-- Bảng cuộc trò chuyện
CREATE TABLE conversations (
    conversation_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    order_id INT, -- Liên kết với đơn hàng nếu có
    last_message TEXT,
    last_message_at DATETIME,
    is_user_archived BIT DEFAULT 0,
    is_supplier_archived BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id, supplier_id, order_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    INDEX idx_user_conversations (user_id, last_message_at),
    INDEX idx_supplier_conversations (supplier_id, last_message_at)
);

-- Bảng tin nhắn
CREATE TABLE messages (
    message_id INT PRIMARY KEY IDENTITY(1,1),
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    sender_type VARCHAR(20) NOT NULL, -- 'user', 'supplier', 'system'
    message_text TEXT,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'file', 'system'
    attachment_url VARCHAR(500),
    is_read BIT DEFAULT 0,
    read_at DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    INDEX idx_conversation_messages (conversation_id, created_at)
);

-- =====================================================
-- DIỄN ĐÀN CỘNG ĐỒNG (COMMUNITY FORUM)
-- =====================================================

-- Bảng danh mục diễn đàn
CREATE TABLE forum_categories (
    forum_category_id INT PRIMARY KEY IDENTITY(1,1),
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng bài viết diễn đàn
CREATE TABLE forum_posts (
    post_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    forum_category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'discussion', -- 'discussion', 'review', 'recipe', 'question'
    related_item_id INT, -- Liên kết với sản phẩm nếu là review
    related_supplier_id INT, -- Liên kết với cửa hàng
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned BIT DEFAULT 0,
    is_locked BIT DEFAULT 0,
    is_visible BIT DEFAULT 1,
    is_flagged BIT DEFAULT 0,
    flagged_count INT DEFAULT 0,
    moderated_by INT,
    moderated_at DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (forum_category_id) REFERENCES forum_categories(forum_category_id),
    FOREIGN KEY (related_item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (related_supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (moderated_by) REFERENCES users(user_id),
    INDEX idx_category_posts (forum_category_id, created_at),
    INDEX idx_user_posts (user_id)
);

-- Bảng hình ảnh bài viết
CREATE TABLE forum_post_images (
    image_id INT PRIMARY KEY IDENTITY(1,1),
    post_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id)
);

-- Bảng bình luận bài viết
CREATE TABLE forum_comments (
    comment_id INT PRIMARY KEY IDENTITY(1,1),
    post_id INT NOT NULL,
    parent_comment_id INT, -- Cho phép trả lời bình luận
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    is_visible BIT DEFAULT 1,
    is_flagged BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id),
    FOREIGN KEY (parent_comment_id) REFERENCES forum_comments(comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_post_comments (post_id, created_at)
);

-- Bảng lượt thích bài viết
CREATE TABLE forum_post_likes (
    like_id INT PRIMARY KEY IDENTITY(1,1),
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    UNIQUE (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng lượt thích bình luận
CREATE TABLE forum_comment_likes (
    like_id INT PRIMARY KEY IDENTITY(1,1),
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    UNIQUE (comment_id, user_id),
    FOREIGN KEY (comment_id) REFERENCES forum_comments(comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =====================================================
-- QUẢN LÝ KHIẾU Nại VÀ BÁO CÁO (COMPLAINTS & REPORTS)
-- =====================================================

-- Bảng báo cáo vi phạm nội dung (bài viết/bình luận)
CREATE TABLE content_reports (
    report_id INT PRIMARY KEY IDENTITY(1,1),
    reported_by INT NOT NULL,
    content_type VARCHAR(20) NOT NULL, -- 'post', 'comment', 'review'
    content_id INT NOT NULL,
    report_reason VARCHAR(100) NOT NULL, -- 'spam', 'offensive', 'misleading', 'inappropriate'
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'action_taken', 'dismissed'
    reviewed_by INT,
    reviewed_at DATETIME,
    action_taken TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (reported_by) REFERENCES users(user_id) ,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id),
    INDEX idx_status_created (status, created_at)
);

-- Bảng khiếu nại (liên quan tới đơn hàng, dịch vụ, thanh toán)
CREATE TABLE complaints (
    complaint_id INT PRIMARY KEY IDENTITY(1,1),
    complaint_type VARCHAR(50) NOT NULL, -- 'order_issue', 'food_safety', 'service', 'payment'
    reported_by INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    related_order_id INT,
    related_supplier_id INT,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    assigned_to INT,
    resolution TEXT,
    resolved_at DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (reported_by) REFERENCES users(user_id),
    FOREIGN KEY (related_order_id) REFERENCES orders(order_id),
    FOREIGN KEY (related_supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id),
    INDEX idx_status_created (status, created_at),
    INDEX idx_assigned_to (assigned_to)
);

-- Bảng hình ảnh khiếu nại
CREATE TABLE complaint_images (
    image_id INT PRIMARY KEY IDENTITY(1,1),
    complaint_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id)
);

-- =====================================================
-- QUẢN LÝ GIẢM GIÁ (DISCOUNTS)
-- =====================================================

CREATE TABLE discounts (
    discount_id INT PRIMARY KEY IDENTITY(1,1),
    discount_code VARCHAR(50) NOT NULL UNIQUE,
    discount_name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT, -- Số lần sử dụng tối đa
    usage_count INT DEFAULT 0,
    usage_limit_per_user INT DEFAULT 1,
    applicable_to VARCHAR(20) DEFAULT 'all', -- 'all', 'specific_suppliers', 'specific_categories', 'specific_items'
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BIT DEFAULT 1,
    created_by INT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    INDEX idx_active_date (is_active, start_date, end_date),
    INDEX idx_code (discount_code)
);

-- Bảng nhà cung cấp áp dụng giảm giá
CREATE TABLE discount_suppliers (
    discount_id INT NOT NULL,
    supplier_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (discount_id, supplier_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Bảng danh mục áp dụng giảm giá
CREATE TABLE discount_categories (
    discount_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (discount_id, category_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id),
    FOREIGN KEY (category_id) REFERENCES food_categories(category_id)
);

-- Bảng sản phẩm áp dụng giảm giá
CREATE TABLE discount_items (
    discount_id INT NOT NULL,
    item_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (discount_id, item_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id)
);

-- Bảng lịch sử sử dụng giảm giá
CREATE TABLE discount_usage (
    usage_id INT PRIMARY KEY IDENTITY(1,1),
    discount_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    INDEX idx_user_discount (user_id, discount_id)
);

-- =====================================================
-- THỐNG KÊ TÁC ĐỘNG (IMPACT STATISTICS)
-- =====================================================

-- Bảng thống kê tác động người dùng
CREATE TABLE user_impact_stats (
    stat_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL UNIQUE,
    total_meals_saved INT DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0.00,
    total_co2_reduced_kg DECIMAL(10, 2) DEFAULT 0.00,
    total_money_saved DECIMAL(10, 2) DEFAULT 0.00,
    total_orders INT DEFAULT 0,
    first_order_date DATE,
    last_order_date DATE,
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng thống kê tác động nhà cung cấp
CREATE TABLE supplier_impact_stats (
    stat_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL UNIQUE,
    total_meals_saved INT DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0.00,
    total_co2_reduced_kg DECIMAL(10, 2) DEFAULT 0.00,
    total_revenue_recovered DECIMAL(12, 2) DEFAULT 0.00,
    total_orders_fulfilled INT DEFAULT 0,
    waste_reduction_percentage DECIMAL(5, 2) DEFAULT 0.00,
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Bảng thống kê tác động toàn hệ thống
CREATE TABLE system_impact_stats (
    stat_id INT PRIMARY KEY IDENTITY(1,1),
    stat_date DATE NOT NULL UNIQUE,
    total_meals_saved INT DEFAULT 0,
    total_food_saved_kg DECIMAL(12, 2) DEFAULT 0.00,
    total_co2_reduced_kg DECIMAL(12, 2) DEFAULT 0.00,
    total_active_users INT DEFAULT 0,
    total_active_suppliers INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT GETDATE()
);

-- =====================================================
-- THANH TOÁN (PAYMENT)
-- =====================================================

-- Bảng giao dịch thanh toán
CREATE TABLE payment_transactions (
    transaction_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_code VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'VND',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'success', 'failed', 'refunded'
    payment_gateway_response TEXT,
    paid_at DATETIME,
    refunded_at DATETIME,
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    INDEX idx_status (status),
    INDEX idx_order_id (order_id)
);

-- =====================================================
-- CHECKLIST AN TOÀN THỰC PHẨM (FOOD SAFETY CHECKLIST)
-- =====================================================

-- Bảng mẫu checklist
CREATE TABLE safety_checklist_templates (
    template_id INT PRIMARY KEY IDENTITY(1,1),
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    checklist_items NVARCHAR(MAX) NOT NULL, -- JSON array of checklist items
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Bảng checklist đã hoàn thành
CREATE TABLE completed_safety_checklists (
    checklist_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    item_id INT,
    template_id INT NOT NULL,
    checklist_data NVARCHAR(MAX) NOT NULL, -- JSON - Answered checklist
    completed_by INT NOT NULL,
    completed_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (template_id) REFERENCES safety_checklist_templates(template_id),
    FOREIGN KEY (completed_by) REFERENCES users(user_id)
);

-- =====================================================
-- ĐƠN VỊ VẬN CHUYỂN (DELIVERY)
-- =====================================================

-- Bảng đơn vị vận chuyển
CREATE TABLE delivery_partners (
    partner_id INT PRIMARY KEY IDENTITY(1,1),
    partner_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    api_endpoint VARCHAR(500),
    api_key VARCHAR(255),
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Bảng thông tin giao hàng
CREATE TABLE deliveries (
    delivery_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL UNIQUE,
    partner_id INT,
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    vehicle_number VARCHAR(50),
    pickup_time DATETIME,
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    tracking_code VARCHAR(100),
    delivery_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'
    delivery_note TEXT,
    signature_url VARCHAR(500),
    photo_proof_url VARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (partner_id) REFERENCES delivery_partners(partner_id),
    INDEX idx_status (delivery_status)
);

-- =====================================================
-- TỔ CHỨC THIỆN NGUYỆN (CHARITY ORGANIZATIONS)
-- =====================================================

-- Bảng tổ chức thiện nguyện
CREATE TABLE charity_organizations (
    charity_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL UNIQUE,
    organization_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_at DATETIME,
    verified_by INT,
    total_meals_received INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (verified_by) REFERENCES users(user_id)
);

-- =====================================================
-- QUẢN TRỊ HỆ THỐNG (SYSTEM ADMINISTRATION)
-- =====================================================

-- Bảng quyền hạn
CREATE TABLE permissions (
    permission_id INT PRIMARY KEY IDENTITY(1,1),
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng vai trò - quyền hạn
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) 
);

-- Bảng log hoạt động hệ thống
CREATE TABLE system_logs (
    log_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    action_type VARCHAR(100) NOT NULL, -- 'login', 'create_order', 'approve_supplier', etc.
    table_name VARCHAR(100),
    record_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user_logs (user_id, created_at),
    INDEX idx_action_type (action_type, created_at)
);

-- Bảng cấu hình hệ thống
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY IDENTITY(1,1),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    is_public BIT DEFAULT 0,
    updated_by INT,
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- =====================================================
-- SESSION & SECURITY
-- =====================================================

-- Bảng phiên đăng nhập
CREATE TABLE user_sessions (
    session_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_user_sessions (user_id, expires_at)
);

-- Bảng lịch sử đăng nhập
CREATE TABLE login_history (
    history_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    login_time DATETIME DEFAULT GETDATE(),
    logout_time DATETIME,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_status VARCHAR(20) DEFAULT 'success', -- 'success', 'failed'
    failure_reason VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user_login (user_id, login_time)
);

-- Bảng thiết bị đáng tin cậy
CREATE TABLE trusted_devices (
    device_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    device_name VARCHAR(255),
    device_fingerprint VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_trusted BIT DEFAULT 1,
    last_used DATETIME DEFAULT GETDATE(),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =====================================================
-- EMAIL & NOTIFICATION TEMPLATES
-- =====================================================

-- Bảng mẫu email
CREATE TABLE email_templates (
    template_id INT PRIMARY KEY IDENTITY(1,1),
    template_code VARCHAR(50) NOT NULL UNIQUE,
    template_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    variables NVARCHAR(MAX), -- JSON - Available variables for template
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Bảng lịch sử gửi email
CREATE TABLE email_logs (
    log_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    template_id INT,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
    error_message TEXT,
    sent_at DATETIME,
    opened_at DATETIME,
    clicked_at DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ,
    FOREIGN KEY (template_id) REFERENCES email_templates(template_id),
    INDEX idx_user_logs (user_id, created_at),
    INDEX idx_status (status)
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

-- Bảng báo cáo hàng ngày
CREATE TABLE daily_reports (
    report_id INT PRIMARY KEY IDENTITY(1,1),
    report_date DATE NOT NULL UNIQUE,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    total_platform_fees DECIMAL(12, 2) DEFAULT 0.00,
    total_users_registered INT DEFAULT 0,
    total_suppliers_registered INT DEFAULT 0,
    total_food_saved_kg DECIMAL(12, 2) DEFAULT 0.00,
    total_co2_reduced_kg DECIMAL(12, 2) DEFAULT 0.00,
    average_order_value DECIMAL(10, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT GETDATE()
);

-- =====================================================
-- INSERT INITIAL DATA
-- =====================================================

-- Insert default roles
INSERT INTO roles (role_name, description) VALUES
('customer', 'Khách hàng mua thực phẩm'),
('supplier', 'Nhà cung cấp/cửa hàng'),
('admin', 'Quản trị viên hệ thống'),
('moderator', 'Kiểm duyệt viên');

-- Insert business types
INSERT INTO business_types (type_name, description) VALUES
('restaurant', 'Nhà hàng'),
('cafe', 'Quán cà phê'),
('supermarket', 'Siêu thị'),
('bakery', 'Tiệm bánh'),
('street_food', 'Quán ăn vỉa hè'),
('hotel', 'Khách sạn');

-- Insert product types
INSERT INTO product_types (type_name, type_name_vi, description) VALUES
('surprise_bag_cooked', 'Túi bất ngờ - Đồ đã chế biến', 'Túi chứa các món ăn đã chế biến ngẫu nhiên'),
('surprise_bag_raw', 'Túi bất ngờ - Đồ chưa chế biến', 'Túi chứa nguyên liệu tươi sống ngẫu nhiên'),
('specific_cooked', 'Món cụ thể - Đã chế biến', 'Món ăn đã chế biến cụ thể'),
('specific_raw', 'Món cụ thể - Nguyên liệu', 'Nguyên liệu tươi sống cụ thể');

-- Insert food statuses
INSERT INTO food_statuses (status_name, status_name_vi, description, storage_instruction) VALUES
('hot', 'Nóng', 'Món ăn nóng cần dùng ngay', 'Dùng trong vòng 2-4 giờ, không để lạnh lại'),
('cold', 'Lạnh', 'Món ăn lạnh', 'Bảo quản trong tủ lạnh, dùng trong 24 giờ'),
('fresh', 'Tươi sống', 'Nguyên liệu tươi sống', 'Bảo quản lạnh, sử dụng trong 1-2 ngày'),
('frozen', 'Đông lạnh', 'Thực phẩm đông lạnh', 'Bảo quản trong ngăn đá'),
('packaged', 'Đóng gói', 'Thực phẩm đóng gói sẵn', 'Xem hướng dẫn trên bao bì');

-- Insert order statuses
INSERT INTO order_statuses (status_name, status_name_vi, description) VALUES
('pending', 'Chờ xác nhận', 'Đơn hàng đang chờ nhà cung cấp xác nhận'),
('confirmed', 'Đã xác nhận', 'Đơn hàng đã được xác nhận'),
('preparing', 'Đang chuẩn bị', 'Đang chuẩn bị hàng'),
('ready', 'Sẵn sàng', 'Hàng đã sẵn sàng để nhận'),
('picked_up', 'Đã nhận', 'Khách hàng đã nhận hàng'),
('completed', 'Hoàn thành', 'Đơn hàng hoàn thành'),
('cancelled', 'Đã hủy', 'Đơn hàng đã bị hủy'),
('refunded', 'Đã hoàn tiền', 'Đơn hàng đã hoàn tiền');

-- Insert food categories
INSERT INTO food_categories (parent_category_id, category_name, category_name_en, description) VALUES
(NULL, 'Món chính', 'Main Dishes', 'Các món ăn chính'),
(NULL, 'Món phụ', 'Side Dishes', 'Các món ăn phụ'),
(NULL, 'Đồ uống', 'Beverages', 'Nước uống các loại'),
(NULL, 'Tráng miệng', 'Desserts', 'Món tráng miệng'),
(NULL, 'Bánh mì & Bánh ngọt', 'Bread & Pastries', 'Bánh mì và các loại bánh'),
(NULL, 'Rau củ quả', 'Vegetables & Fruits', 'Rau củ quả tươi'),
(NULL, 'Thịt & Hải sản', 'Meat & Seafood', 'Thịt và hải sản tươi'),
(NULL, 'Sữa & Trứng', 'Dairy & Eggs', 'Sản phẩm từ sữa và trứng');

-- Insert dietary preferences
INSERT INTO dietary_preferences (preference_name, description) VALUES
('vegetarian', 'Chay (Vegetarian)'),
('vegan', 'Thuần chay (Vegan)'),
('halal', 'Halal'),
('gluten_free', 'Không gluten'),
('dairy_free', 'Không sữa'),
('nut_free', 'Không hạt'),
('low_carb', 'Ít carb'),
('keto', 'Keto');

-- Insert forum categories
INSERT INTO forum_categories (category_name, description, display_order) VALUES
('Bảng tin', 'Tin tức và thông báo chung', 1),
('Chia sẻ kinh nghiệm', 'Chia sẻ kinh nghiệm nhận đồ và sử dụng', 2),
('Review cửa hàng', 'Đánh giá và review các cửa hàng', 3),
('Công thức nấu ăn', 'Chia sẻ công thức từ thực phẩm dư thừa', 4),
('Hỏi đáp', 'Giải đáp thắc mắc', 5);

-- Insert permissions
INSERT INTO permissions (permission_name, description) VALUES
('manage_users', 'Quản lý người dùng'),
('manage_suppliers', 'Quản lý nhà cung cấp'),
('manage_orders', 'Quản lý đơn hàng'),
('manage_content', 'Quản lý nội dung'),
('manage_reports', 'Quản lý báo cáo'),
('manage_system', 'Quản lý hệ thống'),
('moderate_forum', 'Kiểm duyệt diễn đàn'),
('view_analytics', 'Xem thống kê');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_fee_percentage', '5', 'number', 'Phần trăm phí nền tảng', 0),
('min_order_amount', '20000', 'number', 'Giá trị đơn hàng tối thiểu (VND)', 1),
('co2_reduction_factor', '2.5', 'number', 'Hệ số tính CO2 giảm (kg CO2/kg thực phẩm)', 0),
('max_pickup_distance_km', '10', 'number', 'Khoảng cách nhận hàng tối đa (km)', 1),
('auto_cancel_order_hours', '2', 'number', 'Tự động hủy đơn sau X giờ nếu không xác nhận', 0);

-- =====================================================
-- END OF DATABASE DESIGN
-- =====================================================