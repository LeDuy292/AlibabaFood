-- =====================================================
-- ALIBABA FOOD - DATABASE DESIGN (SQL SERVER)
-- Khu vực: Hòa Phường, Ngũ Hành Sơn, Đà Nẵng, Việt Nam
-- =====================================================

-- Create Database với collation hỗ trợ tiếng Việt
CREATE DATABASE AlibabaFood COLLATE Vietnamese_CI_AS;
GO

USE AlibabaFood;
GO

-- =====================================================
-- QUẢN LÝ NGƯỜI DÙNG (USERS MANAGEMENT)
-- =====================================================

-- Bảng vai trò người dùng
CREATE TABLE roles (
    role_id INT PRIMARY KEY IDENTITY(1,1),
    role_name VARCHAR(50) NOT NULL UNIQUE,
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
    full_name NVARCHAR(255) NOT NULL,
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
    address_type VARCHAR(20),
    address_line1 NVARCHAR(500) NOT NULL,
    address_line2 NVARCHAR(500),
    ward NVARCHAR(100),
    district NVARCHAR(100),
    city NVARCHAR(100) NOT NULL,
    province NVARCHAR(100) NOT NULL,
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
    notification_type VARCHAR(50),
    is_read BIT DEFAULT 0,
    related_id INT,
    related_type VARCHAR(50),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================================================
-- QUẢN LÝ NHÀ CUNG CẤP (SUPPLIER MANAGEMENT)
-- =====================================================

-- Bảng loại hình kinh doanh
CREATE TABLE business_types (
    business_type_id INT PRIMARY KEY IDENTITY(1,1),
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng nhà cung cấp/cửa hàng
CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL UNIQUE,
    business_name NVARCHAR(255) NOT NULL,
    business_type_id INT NOT NULL,
    business_registration_number VARCHAR(100),
    tax_code VARCHAR(50),
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    description NVARCHAR(MAX),
    address_line1 NVARCHAR(500) NOT NULL,
    address_line2 NVARCHAR(500),
    ward NVARCHAR(100),
    district NVARCHAR(100),
    city NVARCHAR(100) NOT NULL,
    province NVARCHAR(100) NOT NULL,
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

-- =====================================================
-- QUẢN LÝ DANH MỤC THỰC PHẨM (FOOD CATEGORIES)
-- =====================================================

-- Bảng danh mục thực phẩm
CREATE TABLE food_categories (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    parent_category_id INT,
    category_name NVARCHAR(100) NOT NULL,
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
    preference_name VARCHAR(100) NOT NULL UNIQUE,
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
    type_name VARCHAR(50) NOT NULL UNIQUE,
    type_name_vi NVARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng trạng thái thực phẩm
CREATE TABLE food_statuses (
    status_id INT PRIMARY KEY IDENTITY(1,1),
    status_name VARCHAR(50) NOT NULL UNIQUE,
    status_name_vi NVARCHAR(100) NOT NULL,
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
    item_name NVARCHAR(255) NOT NULL,
    description TEXT,
    is_surprise_bag BIT DEFAULT 0,
    quantity_available INT NOT NULL DEFAULT 0,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    food_status_id INT NOT NULL,
    preparation_time DATETIME NOT NULL,
    safe_consumption_time DATETIME NOT NULL,
    expiry_time DATETIME NOT NULL,
    pickup_start_time DATETIME,
    pickup_end_time DATETIME,
    is_pre_order BIT DEFAULT 0,
    weight_kg DECIMAL(8, 3),
    calories INT,
    allergens TEXT,
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
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
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

-- =====================================================
-- AUTHENTICATION TABLES
-- =====================================================

-- Bảng lịch sử đăng nhập
CREATE TABLE login_history (
    history_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    login_time DATETIME DEFAULT GETDATE(),
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    is_successful BIT DEFAULT 1,
    failure_reason VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng phiên người dùng
CREATE TABLE user_sessions (
    session_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    session_token VARCHAR(500) NOT NULL UNIQUE,
    refresh_token VARCHAR(500),
    device_info VARCHAR(500),
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),
    expires_at DATETIME NOT NULL,
    is_active BIT DEFAULT 1,
    last_activity DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================================================
-- CÁC BẢNG CÒN THIẾU CHO DATABASE HOÀN CHỈNH
-- =====================================================

-- Bảng giờ hoạt động đặc biệt của cửa hàng
CREATE TABLE supplier_special_hours (
    special_hour_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    date DATE NOT NULL,
    opening_time TIME,
    closing_time TIME,
    is_closed BIT DEFAULT 0,
    reason VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

-- Bảng tài liệu xác minh nhà cung cấp
CREATE TABLE supplier_verification_documents (
    document_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
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
    violation_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    reported_by INT,
    related_order_id INT,
    action_taken VARCHAR(50),
    ban_start_date DATETIME,
    ban_end_date DATETIME,
    is_resolved BIT DEFAULT 0,
    resolved_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(user_id)
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

-- Bảng túi bất ngờ
CREATE TABLE surprise_bags (
    bag_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL,
    product_type_id INT NOT NULL,
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
    estimated_items_count INT,
    estimated_weight_kg DECIMAL(8, 3),
    includes_allergens TEXT,
    includes_categories TEXT,
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

-- Bảng yêu thích sản phẩm
CREATE TABLE favorite_items (
    favorite_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
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

-- Bảng giỏ hàng
CREATE TABLE cart_items (
    cart_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    item_id INT,
    bag_id INT,
    quantity INT NOT NULL DEFAULT 1,
    added_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE (user_id, item_id, bag_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (bag_id) REFERENCES surprise_bags(bag_id)
);

-- Bảng trạng thái đơn hàng
CREATE TABLE order_statuses (
    status_id INT PRIMARY KEY IDENTITY(1,1),
    status_name VARCHAR(50) NOT NULL UNIQUE,
    status_name_vi NVARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng đơn hàng
CREATE TABLE orders (
    order_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    order_status_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    pickup_time DATETIME,
    delivery_address TEXT,
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    notes TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (order_status_id) REFERENCES order_statuses(status_id)
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    item_id INT,
    bag_id INT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (bag_id) REFERENCES surprise_bags(bag_id)
);

-- Bảng giao dịch thanh toán
CREATE TABLE payment_transactions (
    transaction_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_code VARCHAR(100),
    payment_date DATETIME DEFAULT GETDATE(),
    notes TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Bảng giảm giá
CREATE TABLE discount_items (
    discount_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT,
    discount_code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT,
    usage_count INT DEFAULT 0,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Bảng sử dụng giảm giá
CREATE TABLE discount_usage (
    usage_id INT PRIMARY KEY IDENTITY(1,1),
    discount_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    used_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (discount_id) REFERENCES discount_items(discount_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Bảng thống kê tác động người dùng
CREATE TABLE user_impact_stats (
    stat_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0,
    total_discount_saved DECIMAL(10, 2) DEFAULT 0,
    carbon_footprint_saved_kg DECIMAL(10, 2) DEFAULT 0,
    last_updated DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng thống kê tác động nhà cung cấp
CREATE TABLE supplier_impact_stats (
    stat_id INT PRIMARY KEY IDENTITY(1,1),
    supplier_id INT NOT NULL UNIQUE,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0,
    total_discount_given DECIMAL(10, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    carbon_footprint_saved_kg DECIMAL(10, 2) DEFAULT 0,
    last_updated DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

-- Bảng thống kê tác động hệ thống
CREATE TABLE system_impact_stats (
    stat_id INT PRIMARY KEY IDENTITY(1,1),
    stat_date DATE NOT NULL UNIQUE,
    total_orders INT DEFAULT 0,
    total_users INT DEFAULT 0,
    total_suppliers INT DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0,
    total_discount_given DECIMAL(10, 2) DEFAULT 0,
    carbon_footprint_saved_kg DECIMAL(10, 2) DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng quyền hạn
CREATE TABLE permissions (
    permission_id INT PRIMARY KEY IDENTITY(1,1),
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Bảng cài đặt hệ thống
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY IDENTITY(1,1),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    is_public BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- =====================================================
-- CỘNG ĐỒNG & ĐÁNH GIÁ (COMMUNITY & REVIEWS)
-- =====================================================

-- Bảng bài viết cộng đồng
CREATE TABLE community_posts (
    post_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    image_url VARCHAR(500),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng bình luận cộng đồng
CREATE TABLE community_comments (
    comment_id INT PRIMARY KEY IDENTITY(1,1),
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (post_id) REFERENCES community_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE NO ACTION
);

-- Bảng đánh giá sản phẩm
CREATE TABLE product_reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
);

-- Bảng đánh giá cửa hàng
CREATE TABLE supplier_reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    rating_food INT NOT NULL CHECK (rating_food BETWEEN 1 AND 5),
    rating_accuracy INT NOT NULL CHECK (rating_accuracy BETWEEN 1 AND 5),
    rating_service INT NOT NULL CHECK (rating_service BETWEEN 1 AND 5),
    rating_speed INT NOT NULL CHECK (rating_speed BETWEEN 1 AND 5),
    comment NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION
);

-- Bảng phản hồi và góp ý
CREATE TABLE user_feedbacks (
    feedback_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    feedback_type VARCHAR(50) NOT NULL, -- 'feature', 'bug', 'ui', 'promo', 'other'
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng báo cáo vi phạm
CREATE TABLE violation_reports (
    report_id INT PRIMARY KEY IDENTITY(1,1),
    reporter_id INT NOT NULL,
    reported_supplier_id INT,
    reported_item_id INT,
    report_type VARCHAR(50) NOT NULL, -- 'incorrect_info', 'wrong_image', 'bad_quality', 'fraud', 'other'
    description NVARCHAR(MAX) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'resolved'
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION,
    FOREIGN KEY (reported_item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
);

PRINT '✅ Done! Created all tables for complete database.';
GO

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert roles trước (cần thiết cho users)
INSERT INTO roles (role_name, description) VALUES
('customer', N'Khách hàng'),
('supplier', N'Nhà cung cấp'),
('admin', N'Quản trị viên'),
('moderator', N'Người kiểm duyệt');

PRINT 'Inserted roles';

-- Insert users trước (cần thiết cho suppliers)
DECLARE @role_supplier INT;
SELECT @role_supplier = role_id FROM roles WHERE role_name = 'supplier';

INSERT INTO users (email, username, password_hash, full_name, phone, role_id) VALUES
('supplier1@alibabafood.com', 'supplier1', 'hashed_password_1', N'Nguyễn Văn A', '0901234567', @role_supplier),
('supplier2@alibabafood.com', 'supplier2', 'hashed_password_2', N'Trần Thị B', '0902345678', @role_supplier),
('supplier3@alibabafood.com', 'supplier3', 'hashed_password_3', N'Lê Văn C', '0903456789', @role_supplier),
('supplier4@alibabafood.com', 'supplier4', 'hashed_password_4', N'Phạm Thị D', '0904567890', @role_supplier),
('supplier5@alibabafood.com', 'supplier5', 'hashed_password_5', N'Hoàng Văn E', '0905678901', @role_supplier),
('supplier6@alibabafood.com', 'supplier6', 'hashed_password_6', N'Nguyễn Thị F', '0906789012', @role_supplier);

PRINT 'Inserted users';

-- Insert business types
INSERT INTO business_types (type_name, description) VALUES
('restaurant', N'Nhà hàng'),
('cafe', N'Quán cà phê'),
('supermarket', N'Siêu thị'),
('bakery', N'Tiệm bánh');

-- Insert product types
INSERT INTO product_types (type_name, type_name_vi, description) VALUES
('specific_cooked', N'Cooked specific', N'Món ăn cụ thể đã nấu'),
('surprise_bag_cooked', N'Cooked surprise bag', N'Túi bất ngờ món ăn đã nấu'),
('specific_raw', N'Raw specific', N'Nguyên liệu cụ thể chưa chế biến'),
('surprise_bag_raw', N'Raw surprise bag', N'Túi bất ngờ nguyên liệu chưa chế biến');

-- Insert food statuses
INSERT INTO food_statuses (status_name, status_name_vi, description) VALUES
('hot', N'Nóng', N'Món ăn nóng'),
('cold', N'Lạnh', N'Món ăn lạnh'),
('fresh', N'Tươi', N'Món ăn tươi'),
('frozen', N'Đông lạnh', N'Món ăn đông lạnh'),
('packaged', N'Đóng gói', N'Món ăn đã đóng gói');

-- Insert food categories
INSERT INTO food_categories (category_name, category_name_en, description) VALUES
(N'Cơm', 'Rice dishes', N'Các món cơm'),
(N'Bánh mì', 'Bread', N'Các loại bánh mì'),
(N'Đồ uống', 'Drinks', N'Các loại đồ uống'),
(N'Thịt & Hải sản', 'Meat & Seafood', N'Các món thịt và hải sản'),
(N'Bánh ngọt', 'Pastries', N'Các loại bánh ngọt');

-- Insert dietary preferences
INSERT INTO dietary_preferences (preference_name, description) VALUES
('vegetarian', N'Chay'),
('vegan', N'Chay thuần túy'),
('halal', N'Halal'),
('gluten_free', N'Không gluten');

-- Insert suppliers
DECLARE @user1 INT, @user2 INT, @user3 INT, @user4 INT, @user5 INT, @user6 INT;

-- Lấy user_id từ users đã tạo
SELECT @user1 = user_id FROM users WHERE email = 'supplier1@alibabafood.com';
SELECT @user2 = user_id FROM users WHERE email = 'supplier2@alibabafood.com';
SELECT @user3 = user_id FROM users WHERE email = 'supplier3@alibabafood.com';
SELECT @user4 = user_id FROM users WHERE email = 'supplier4@alibabafood.com';
SELECT @user5 = user_id FROM users WHERE email = 'supplier5@alibabafood.com';
SELECT @user6 = user_id FROM users WHERE email = 'supplier6@alibabafood.com';

INSERT INTO suppliers (user_id, business_name, business_type_id, address_line1, ward, district, city, province, latitude, longitude, phone, opening_time, closing_time) VALUES
(@user1, N'Quán Cơm Gia Đình A', 1, N'123 Nguyễn Văn Linh', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0678, 108.2448, '0901234567', '10:00', '21:00'),
(@user2, N'Bánh Mì Việt B', 3, N'456 Võ Nguyên Giáp', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0685, 108.2455, '0902345678', '06:00', '18:00'),
(@user3, N'Cà Phê Góc Phố C', 2, N'789 Trường Sa', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0692, 108.2462, '0903456789', '07:00', '22:00'),
(@user4, N'Nhà Hàng Hải Sản D', 1, N'321 Lê Văn Duyệt', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0699, 108.2469, '0904567890', '11:00', '22:00'),
(@user5, N'Tiệm Bánh Ngọt E', 4, N'654 Hoàng Sa', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0706, 108.2476, '0905678901', '08:00', '20:00'),
(@user6, N'Shop Thực Phẩm F', 1, N'789 Hoàng Diệu', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0714, 108.2483, '0906789012', '09:00', '21:00');

PRINT 'Inserted suppliers';

-- Insert food items
DECLARE @ptype INT, @fstatus_hot INT, @fstatus_cold INT;
DECLARE @cat_com INT, @cat_banh INT, @cat_drink INT, @cat_thit INT, @cat_banhngot INT;
DECLARE @sup1 INT, @sup2 INT, @sup3 INT, @sup4 INT, @sup5 INT, @sup6 INT;

SELECT @ptype = product_type_id FROM product_types WHERE type_name = 'specific_cooked';
SELECT @fstatus_hot = status_id FROM food_statuses WHERE status_name = 'hot';
SELECT @fstatus_cold = status_id FROM food_statuses WHERE status_name = 'cold';
SELECT @cat_com = category_id FROM food_categories WHERE category_name_en = 'Rice dishes';
SELECT @cat_banh = category_id FROM food_categories WHERE category_name_en = 'Bread';
SELECT @cat_drink = category_id FROM food_categories WHERE category_name_en = 'Drinks';
SELECT @cat_thit = category_id FROM food_categories WHERE category_name_en = 'Meat & Seafood';
SELECT @cat_banhngot = category_id FROM food_categories WHERE category_name_en = 'Pastries';

-- Lấy supplier_id từ suppliers đã tạo (dùng user_id)
SELECT @sup1 = supplier_id FROM suppliers WHERE user_id = @user1;
SELECT @sup2 = supplier_id FROM suppliers WHERE user_id = @user2;
SELECT @sup3 = supplier_id FROM suppliers WHERE user_id = @user3;
SELECT @sup4 = supplier_id FROM suppliers WHERE user_id = @user4;
SELECT @sup5 = supplier_id FROM suppliers WHERE user_id = @user5;
SELECT @sup6 = supplier_id FROM suppliers WHERE user_id = @user6;

INSERT INTO food_items (supplier_id, product_type_id, category_id, item_name, description, quantity_available, original_price, discounted_price, discount_percentage, food_status_id, preparation_time, safe_consumption_time, expiry_time, pickup_start_time, pickup_end_time, is_pre_order, weight_kg, calories, allergens, ingredients, storage_instructions, reheating_instructions) VALUES
(@sup1, @ptype, @cat_com, N'Cơm gà xối mỡ', N'Cơm gà vàng óng, da giòn, thịt mềm', 10, 45000, 25000, 44.44, @fstatus_hot,
 GETDATE(), DATEADD(hour, 2, GETDATE()), DATEADD(hour, 3, GETDATE()),
 GETDATE(), DATEADD(hour, 2, GETDATE()), 1, 1, 350, 'chicken', N'Gà, cơm, nước sốt', N'Để trong tủ lạnh', N'Hâm nóng trong lò vi sóng 2 phút'),

(@sup1, @ptype, @cat_com, N'Cơm sườn bò chả', N'Cơm sườn bò nướng, chả giò, trứng ốp la', 8, 50000, 30000, 40.00, @fstatus_hot,
 GETDATE(), DATEADD(hour, 2, GETDATE()), DATEADD(hour, 3, GETDATE()),
 GETDATE(), DATEADD(hour, 2, GETDATE()), 1, 1.2, 450, 'pork,egg', N'Sườn bò, chả giò, trứng', N'Để trong tủ lạnh', N'Hâm nóng trong lò vi sóng 3 phút'),

(@sup2, @ptype, @cat_banh, N'Bánh mì thịt nướng', N'Bánh mì thịt nướng, đồ chua, rau thơm', 15, 25000, 15000, 40.00, @fstatus_hot,
 GETDATE(), DATEADD(hour, 1, GETDATE()), DATEADD(hour, 2, GETDATE()),
 GETDATE(), DATEADD(hour, 1, GETDATE()), 1, 0.3, 280, 'pork', N'Thịt heo, bánh mì, đồ chua', N'Để ở nhiệt độ phòng', N'Hâm nóng trong lò vi sóng 1 phút'),

(@sup3, @ptype, @cat_drink, N'Trà sữa trân châu', N'Trà sữa đậm đà, trân châu dai', 20, 30000, 18000, 40.00, @fstatus_cold,
 GETDATE(), DATEADD(hour, 4, GETDATE()), DATEADD(hour, 6, GETDATE()),
 GETDATE(), DATEADD(hour, 4, GETDATE()), 1, 0.5, 150, 'dairy', N'Trà, sữa, trân châu', N'Để trong tủ lạnh', N'Uống lạnh, không cần hâm nóng'),

(@sup3, @ptype, @cat_drink, N'Cà phê sữa đá', N'Cà phê đậm đà, sữa đặc, đá', 25, 20000, 12000, 40.00, @fstatus_cold,
 GETDATE(), DATEADD(hour, 3, GETDATE()), DATEADD(hour, 5, GETDATE()),
 GETDATE(), DATEADD(hour, 3, GETDATE()), 1, 0.3, 80, 'dairy,caffeine', N'Cà phê, sữa, đá', N'Để trong tủ lạnh', N'Uống lạnh, không cần hâm nóng'),

(@sup4, @ptype, @cat_thit, N'Cá kho tộ', N'Cá kho tộ thơm ngon, thịt cá mềm', 12, 60000, 35000, 41.67, @fstatus_hot,
 GETDATE(), DATEADD(hour, 3, GETDATE()), DATEADD(hour, 5, GETDATE()),
 GETDATE(), DATEADD(hour, 3, GETDATE()), 1, 0.8, 400, 'fish', N'Cá, nước mắm, tiêu', N'Để trong tủ lạnh', N'Hâm nóng trong lò vi sóng 3 phút'),

(@sup4, @ptype, @cat_thit, N'Tẩm hấp bia', N'Tẩm hấp bia thơm ngon, thịt mềm', 10, 70000, 40000, 42.86, @fstatus_hot,
 GETDATE(), DATEADD(hour, 3, GETDATE()), DATEADD(hour, 5, GETDATE()),
 GETDATE(), DATEADD(hour, 3, GETDATE()), 1, 1, 500, 'pork,alcohol', N'Thịt heo, bia, gia vị', N'Để trong tủ lạnh', N'Hâm nóng trong lò vi sóng 3 phút'),

(@sup1, @ptype, @cat_com, N'Cơm tấm sườn bò', N'Cơm tấm sườn bò nướng, bì, chả', 8, 55000, 32000, 41.82, @fstatus_hot,
 GETDATE(), DATEADD(hour, 2, GETDATE()), DATEADD(hour, 3, GETDATE()),
 GETDATE(), DATEADD(hour, 2, GETDATE()), 1, 1.1, 420, 'pork', N'Cơm tấm, sườn bò, bì, chả', N'Để trong tủ lạnh', N'Hâm nóng trong lò vi sóng 3 phút'),

(@sup5, @ptype, @cat_banhngot, N'Bánh flan', N'Bánh flan caramel mềm mịn', 15, 20000, 12000, 40.00, @fstatus_cold,
 GETDATE(), DATEADD(hour, 4, GETDATE()), DATEADD(hour, 6, GETDATE()),
 GETDATE(), DATEADD(hour, 4, GETDATE()), 1, 0.2, 180, 'dairy,eggs', N'Trái gà, sữa, caramel', N'Để trong tủ lạnh', N'Uống lạnh, không cần hâm nóng'),

(@sup6, @ptype, @cat_banhngot, N'Combo Đặc Biệt F', N'Combo tối với nhiều món ngon, phù hợp supplier mới', 20, 100000, 75000, 25.00, @fstatus_hot,
 GETDATE(), DATEADD(hour, 2, GETDATE()), DATEADD(hour, 5, GETDATE()),
 GETDATE(), DATEADD(hour, 2, GETDATE()), 1, 1.0, 550, 'pork,dairy', N'Thịt, rau, gia vị', N'Để trong tủ lạnh', N'Hâm nóng trong lò vi sóng 4 phút');

PRINT 'Inserted food items';

-- Insert food item images
DECLARE @item1 INT, @item2 INT, @item3 INT, @item4 INT, @item5 INT, @item6 INT, @item7 INT, @item8 INT, @item9 INT, @item10 INT;

-- Lấy item_id từ food_items đã tạo
SELECT @item1 = item_id FROM food_items WHERE item_name = N'Cơm gà xối mỡ';
SELECT @item2 = item_id FROM food_items WHERE item_name = N'Cơm sườn bò chả';
SELECT @item3 = item_id FROM food_items WHERE item_name = N'Bánh mì thịt nướng';
SELECT @item4 = item_id FROM food_items WHERE item_name = N'Trà sữa trân châu';
SELECT @item5 = item_id FROM food_items WHERE item_name = N'Cà phê sữa đá';
SELECT @item6 = item_id FROM food_items WHERE item_name = N'Cá kho tộ';
SELECT @item7 = item_id FROM food_items WHERE item_name = N'Tẩm hấp bia';
SELECT @item8 = item_id FROM food_items WHERE item_name = N'Cơm tấm sườn bò';
SELECT @item9 = item_id FROM food_items WHERE item_name = N'Bánh flan';
SELECT @item10 = item_id FROM food_items WHERE item_name = N'Combo Đặc Biệt F';

INSERT INTO food_item_images (item_id, image_url, is_primary) VALUES
(@item1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 1),
(@item2, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', 1),
(@item3, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 1),
(@item4, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 1),
(@item5, 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400', 1),
(@item6, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', 1),
(@item7, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', 1),
(@item8, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', 1),
(@item9, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400', 1),
(@item10, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 1);

PRINT 'Inserted food item images';

-- Insert supplier-specific metadata for UI testing
DECLARE @supplier6 INT;
SELECT @supplier6 = supplier_id FROM suppliers WHERE user_id = @user6;

INSERT INTO supplier_special_hours (supplier_id, date, opening_time, closing_time, is_closed, reason) VALUES
(@supplier6, CAST(GETDATE() AS DATE), '09:00', '21:00', 0, N'Giờ mở cửa thường xuyên'),
(@supplier6, DATEADD(day, 1, CAST(GETDATE() AS DATE)), '09:00', '21:00', 0, N'Giờ mở cửa ngày mai');

INSERT INTO supplier_verification_documents (supplier_id, document_type, document_url, document_number, issue_date, expiry_date, status, notes) VALUES
(@supplier6, 'business_license', 'https://example.com/docs/supplier6-license.pdf', 'BL-F-2026-006', CAST(DATEADD(month, -12, GETDATE()) AS DATE), CAST(DATEADD(year, 1, GETDATE()) AS DATE), 'verified', N'Đã xác minh giấy phép kinh doanh');

INSERT INTO supplier_violations (supplier_id, violation_type, description, severity, reported_by, is_resolved, notes) VALUES
(@supplier6, 'late_delivery', N'Giao hàng trễ quá 30 phút', N'medium', NULL, 1, N'Đã xử lý và rút kinh nghiệm');

PRINT 'Inserted supplier metadata';

-- Insert order statuses
INSERT INTO order_statuses (status_name, status_name_vi, description) VALUES
('pending', N'Đang chờ', N'Đơn hàng đang chờ xử lý'),
('confirmed', N'Đã xác nhận', N'Đơn hàng đã được nhà cung cấp xác nhận'),
('preparing', N'Đang chuẩn bị', N'Đơn hàng đang được chuẩn bị'),
('ready', N'Sẵn sàng', N'Đơn hàng đã sẵn sàng để lấy'),
('picked_up', N'Đã lấy', N'Khách hàng đã lấy đơn hàng'),
('completed', N'Hoàn thành', N'Đơn hàng đã hoàn thành'),
('cancelled', N'Đã hủy', N'Đơn hàng đã bị hủy'),
('refunded', N'Đã hoàn tiền', N'Đơn hàng đã được hoàn tiền');

PRINT 'Inserted order_statuses';

-- Insert permissions
INSERT INTO permissions (permission_name, description) VALUES
('user.read', N'Đọc thông tin người dùng'),
('user.write', N'Sửa thông tin người dùng'),
('user.delete', N'Xóa người dùng'),
('supplier.read', N'Đọc thông tin nhà cung cấp'),
('supplier.write', N'Sửa thông tin nhà cung cấp'),
('supplier.delete', N'Xóa nhà cung cấp'),
('product.read', N'Đọc thông tin sản phẩm'),
('product.write', N'Sửa thông tin sản phẩm'),
('product.delete', N'Xóa sản phẩm'),
('order.read', N'Đọc thông tin đơn hàng'),
('order.write', N'Sửa thông tin đơn hàng'),
('order.delete', N'Xóa đơn hàng'),
('admin.full', N'Quyền quản trị viên đầy đủ');

PRINT 'Inserted permissions';

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('app_name', 'AlibabaFood', N'Tên ứng dụng', 1),
('app_version', '1.0.0', N'Version ứng dụng', 1),
('default_currency', 'VND', N'Loại tiền tệ mặc định', 1),
('max_distance_km', '50', N'Khoảng cách tối đa cho giao hàng (km)', 0),
('min_order_amount', '0', N'Số tiền tối thiểu cho đơn hàng', 1),
('enable_notifications', 'true', N'Bật thông báo', 0),
('maintenance_mode', 'false', N'Chế độ bảo trì', 0),
('support_email', 'support@alibabafood.com', N'Email hỗ trợ', 1),
('support_phone', '19001234', N'Số điện thoại hỗ trợ', 1),
('social_facebook', 'https://facebook.com/alibabafood', N'Facebook', 1),
('social_instagram', 'https://instagram.com/alibabafood', N'Instagram', 1),
('social_twitter', 'https://twitter.com/alibabafood', N'Twitter', 1);

PRINT 'Inserted system_settings';

-- Insert user_impact_stats
INSERT INTO user_impact_stats (user_id, total_orders, total_spent, total_food_saved_kg, total_discount_saved, carbon_footprint_saved_kg)
SELECT user_id, 0, 0, 0, 0, 0 FROM users;

PRINT 'Inserted user_impact_stats';

-- Insert supplier_impact_stats
INSERT INTO supplier_impact_stats (supplier_id, total_orders, total_revenue, total_food_saved_kg, total_discount_given, average_rating, carbon_footprint_saved_kg)
SELECT supplier_id, 0, 0, 0, 0, 0, 0 FROM suppliers;

PRINT 'Inserted supplier_impact_stats';

-- Insert system_impact_stats
INSERT INTO system_impact_stats (stat_date, total_orders, total_users, total_suppliers, total_food_saved_kg, total_discount_given, carbon_footprint_saved_kg)
VALUES (CAST(GETDATE() AS DATE), 0, 1, 6, 0, 0, 0);

PRINT 'Inserted system_impact_stats';

PRINT '✅ Done! Database created with complete structure and sample data for AlibabaFood4.';
GO
