-- =====================================================
-- ALIBABA FOOD - DATABASE DESIGN (POSTGRESQL)
-- Khu vực: Hòa Phường, Ngũ Hành Sơn, Đà Nẵng, Việt Nam
-- =====================================================

-- =====================================================
-- QUẢN LÝ NGƯỜI DÙNG (USERS MANAGEMENT)
-- =====================================================

-- Bảng vai trò người dùng
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng người dùng chính
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role_id INT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Bảng roll credits cho Mystery Bag
CREATE TABLE roll_credits (
    credit_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    credits INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_roll_credits_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng địa chỉ người dùng
CREATE TABLE user_addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    address_type VARCHAR(20),
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng thông báo người dùng
CREATE TABLE user_notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    related_id INT,
    related_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================================================
-- QUẢN LÝ NHÀ CUNG CẤP (SUPPLIER MANAGEMENT)
-- =====================================================

-- Bảng loại hình kinh doanh
CREATE TABLE business_types (
    business_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng nhà cung cấp/cửa hàng
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    business_type_id INT NOT NULL,
    business_registration_number VARCHAR(100),
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
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    rating_average DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (business_type_id) REFERENCES business_types(business_type_id)
);

-- =====================================================
-- QUẢN LÝ DANH MỤC THỰC PHẨM (FOOD CATEGORIES)
-- =====================================================

-- Bảng danh mục thực phẩm
CREATE TABLE food_categories (
    category_id SERIAL PRIMARY KEY,
    parent_category_id INT,
    category_name VARCHAR(100) NOT NULL,
    category_name_en VARCHAR(100),
    description TEXT,
    icon_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng nhu cầu ăn uống (dietary preferences)
CREATE TABLE dietary_preferences (
    preference_id SERIAL PRIMARY KEY,
    preference_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- QUẢN LÝ SẢN PHẨM THỰC PHẨM (FOOD ITEMS)
-- =====================================================

-- Bảng loại sản phẩm
CREATE TABLE product_types (
    product_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    type_name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng trạng thái thực phẩm
CREATE TABLE food_statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    status_name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    storage_instruction TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng sản phẩm thực phẩm
CREATE TABLE food_items (
    item_id SERIAL PRIMARY KEY,
    supplier_id INT NOT NULL,
    product_type_id INT NOT NULL,
    category_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_surprise_bag BOOLEAN DEFAULT FALSE,
    quantity_available INT NOT NULL DEFAULT 0,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    food_status_id INT NOT NULL,
    preparation_time TIMESTAMP NOT NULL,
    safe_consumption_time TIMESTAMP NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    pickup_start_time TIMESTAMP,
    pickup_end_time TIMESTAMP,
    is_pre_order BOOLEAN DEFAULT FALSE,
    weight_kg DECIMAL(8, 3),
    calories INT,
    allergens TEXT,
    ingredients TEXT,
    storage_instructions TEXT,
    reheating_instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_at TIMESTAMP,
    total_sold INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (product_type_id) REFERENCES product_types(product_type_id),
    FOREIGN KEY (category_id) REFERENCES food_categories(category_id),
    FOREIGN KEY (food_status_id) REFERENCES food_statuses(status_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- Bảng hình ảnh sản phẩm
CREATE TABLE food_item_images (
    image_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE CASCADE
);

-- =====================================================
-- AUTHENTICATION TABLES
-- =====================================================

-- Bảng lịch sử đăng nhập
CREATE TABLE login_history (
    history_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    is_successful BOOLEAN DEFAULT TRUE,
    failure_reason VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng phiên người dùng
CREATE TABLE user_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(2048) NOT NULL UNIQUE,
    refresh_token VARCHAR(2048),
    device_info VARCHAR(500),
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================================================
-- CÁC BẢNG CÒN THIẾU CHO DATABASE HOÀN CHỈNH
-- =====================================================

-- Bảng giờ hoạt động đặc biệt của cửa hàng
CREATE TABLE supplier_special_hours (
    special_hour_id SERIAL PRIMARY KEY,
    supplier_id INT NOT NULL,
    date DATE NOT NULL,
    opening_time TIME,
    closing_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

-- Bảng tài liệu xác minh nhà cung cấp
CREATE TABLE supplier_verification_documents (
    document_id SERIAL PRIMARY KEY,
    supplier_id INT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    verified_by INT,
    verified_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(user_id)
);

-- Bảng vi phạm của nhà cung cấp
CREATE TABLE supplier_violations (
    violation_id SERIAL PRIMARY KEY,
    supplier_id INT NOT NULL,
    violation_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    reported_by INT,
    related_order_id INT,
    action_taken VARCHAR(50),
    ban_start_date TIMESTAMP,
    ban_end_date TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(user_id)
);

-- Bảng nhu cầu ăn uống của sản phẩm
CREATE TABLE food_item_dietary_preferences (
    item_id INT NOT NULL,
    preference_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (item_id, preference_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (preference_id) REFERENCES dietary_preferences(preference_id) ON DELETE CASCADE
);

-- Bảng lịch sử giá sản phẩm
CREATE TABLE food_item_price_history (
    history_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE CASCADE
);

-- Bảng túi bất ngờ
CREATE TABLE surprise_bags (
    bag_id SERIAL PRIMARY KEY,
    supplier_id INT NOT NULL,
    product_type_id INT NOT NULL,
    bag_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity_available INT NOT NULL DEFAULT 0,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    food_status_id INT NOT NULL,
    preparation_time TIMESTAMP,
    safe_consumption_time TIMESTAMP NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    pickup_start_time TIMESTAMP,
    pickup_end_time TIMESTAMP,
    is_pre_order BOOLEAN DEFAULT FALSE,
    estimated_items_count INT,
    estimated_weight_kg DECIMAL(8, 3),
    includes_allergens TEXT,
    includes_categories TEXT,
    storage_instructions TEXT,
    reheating_instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_at TIMESTAMP,
    total_sold INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (product_type_id) REFERENCES product_types(product_type_id),
    FOREIGN KEY (food_status_id) REFERENCES food_statuses(status_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- Bảng hình ảnh túi bất ngờ
CREATE TABLE surprise_bag_images (
    image_id SERIAL PRIMARY KEY,
    bag_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bag_id) REFERENCES surprise_bags(bag_id) ON DELETE CASCADE
);

-- Bảng yêu thích sản phẩm
CREATE TABLE favorite_items (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
);

-- Bảng yêu thích cửa hàng
CREATE TABLE favorite_suppliers (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, supplier_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Bảng giỏ hàng
CREATE TABLE cart_items (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT,
    bag_id INT,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, item_id, bag_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (bag_id) REFERENCES surprise_bags(bag_id)
);

-- Bảng trạng thái đơn hàng
CREATE TABLE order_statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    status_name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng đơn hàng
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    order_status_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    pickup_time TIMESTAMP,
    delivery_address TEXT,
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (order_status_id) REFERENCES order_statuses(status_id)
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT,
    bag_id INT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id),
    FOREIGN KEY (bag_id) REFERENCES surprise_bags(bag_id)
);

-- Bảng giao dịch thanh toán
CREATE TABLE payment_transactions (
    transaction_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_code VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Bảng giảm giá
CREATE TABLE discount_items (
    discount_id SERIAL PRIMARY KEY,
    supplier_id INT,
    discount_code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT,
    usage_count INT DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Bảng sử dụng giảm giá
CREATE TABLE discount_usage (
    usage_id SERIAL PRIMARY KEY,
    discount_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discount_id) REFERENCES discount_items(discount_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Bảng thống kê tác động người dùng
CREATE TABLE user_impact_stats (
    stat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0,
    total_discount_saved DECIMAL(10, 2) DEFAULT 0,
    carbon_footprint_saved_kg DECIMAL(10, 2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng thống kê tác động nhà cung cấp
CREATE TABLE supplier_impact_stats (
    stat_id SERIAL PRIMARY KEY,
    supplier_id INT NOT NULL UNIQUE,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0,
    total_discount_given DECIMAL(10, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    carbon_footprint_saved_kg DECIMAL(10, 2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

-- Bảng thống kê tác động hệ thống
CREATE TABLE system_impact_stats (
    stat_id SERIAL PRIMARY KEY,
    stat_date DATE NOT NULL UNIQUE,
    total_orders INT DEFAULT 0,
    total_users INT DEFAULT 0,
    total_suppliers INT DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0,
    total_discount_given DECIMAL(10, 2) DEFAULT 0,
    carbon_footprint_saved_kg DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng quyền hạn
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng cài đặt hệ thống
CREATE TABLE system_settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CỘNG ĐỒNG & ĐÁNH GIÁ (COMMUNITY & REVIEWS)
-- =====================================================

-- Bảng bài viết cộng đồng
CREATE TABLE community_posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng bình luận cộng đồng
CREATE TABLE community_comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE NO ACTION
);

-- Bảng đánh giá sản phẩm
CREATE TABLE product_reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
);

-- Bảng đánh giá cửa hàng
CREATE TABLE supplier_reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    rating_food INT NOT NULL CHECK (rating_food BETWEEN 1 AND 5),
    rating_accuracy INT NOT NULL CHECK (rating_accuracy BETWEEN 1 AND 5),
    rating_service INT NOT NULL CHECK (rating_service BETWEEN 1 AND 5),
    rating_speed INT NOT NULL CHECK (rating_speed BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION
);

-- Bảng phản hồi và góp ý
CREATE TABLE user_feedbacks (
    feedback_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    feedback_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng báo cáo vi phạm
CREATE TABLE violation_reports (
    report_id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_supplier_id INT,
    reported_item_id INT,
    report_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION,
    FOREIGN KEY (reported_item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
);

-- =====================================================
-- INSERT SAMPLE DATA (SEED DATA)
-- =====================================================

-- Insert roles trước
INSERT INTO roles (role_name, description) VALUES
('customer', 'Khách hàng'),
('supplier', 'Nhà cung cấp'),
('admin', 'Quản trị viên'),
('moderator', 'Người kiểm duyệt');

-- Insert users (sử dụng subquery tìm role_id)
INSERT INTO users (email, username, password_hash, full_name, phone, role_id) VALUES
('supplier1@alibabafood.com', 'supplier1', 'hashed_password_1', 'Nguyễn Văn A', '0901234567', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier2@alibabafood.com', 'supplier2', 'hashed_password_2', 'Trần Thị B', '0902345678', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier3@alibabafood.com', 'supplier3', 'hashed_password_3', 'Lê Văn C', '0903456789', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier4@alibabafood.com', 'supplier4', 'hashed_password_4', 'Phạm Thị D', '0904567890', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier5@alibabafood.com', 'supplier5', 'hashed_password_5', 'Hoàng Văn E', '0905678901', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier6@alibabafood.com', 'supplier6', 'hashed_password_6', 'Nguyễn Thị F', '0906789012', (SELECT role_id FROM roles WHERE role_name = 'supplier'));

-- Insert business types
INSERT INTO business_types (type_name, description) VALUES
('restaurant', 'Nhà hàng'),
('cafe', 'Quán cà phê'),
('supermarket', 'Siêu thị'),
('bakery', 'Tiệm bánh');

-- Insert product types
INSERT INTO product_types (type_name, type_name_vi, description) VALUES
('specific_cooked', 'Cooked specific', 'Món ăn cụ thể đã nấu'),
('surprise_bag_cooked', 'Cooked surprise bag', 'Túi bất ngờ món ăn đã nấu'),
('specific_raw', 'Raw specific', 'Nguyên liệu cụ thể chưa chế biến'),
('surprise_bag_raw', 'Raw surprise bag', 'Túi bất ngờ nguyên liệu chưa chế biến');

-- Insert food statuses
INSERT INTO food_statuses (status_name, status_name_vi, description) VALUES
('hot', 'Nóng', 'Món ăn nóng'),
('cold', 'Lạnh', 'Món ăn lạnh'),
('fresh', 'Tươi', 'Món ăn tươi'),
('frozen', 'Đông lạnh', 'Món ăn đông lạnh'),
('packaged', 'Đóng gói', 'Món ăn đã đóng gói');

-- Insert food categories
INSERT INTO food_categories (category_name, category_name_en, description) VALUES
('Cơm', 'Rice dishes', 'Các món cơm'),
('Bánh mì', 'Bread', 'Các loại bánh mì'),
('Đồ uống', 'Drinks', 'Các loại đồ uống'),
('Thịt & Hải sản', 'Meat & Seafood', 'Các món thịt và hải sản'),
('Bánh ngọt', 'Pastries', 'Các loại bánh ngọt');

-- Insert dietary preferences
INSERT INTO dietary_preferences (preference_name, description) VALUES
('vegetarian', 'Chay'),
('vegan', 'Chay thuần túy'),
('halal', 'Halal'),
('gluten_free', 'Không gluten');

-- Insert suppliers
INSERT INTO suppliers (user_id, business_name, business_type_id, address_line1, ward, district, city, province, latitude, longitude, phone, opening_time, closing_time) VALUES
((SELECT user_id FROM users WHERE email = 'supplier1@alibabafood.com'), 'Quán Cơm Gia Đình A', 1, '123 Nguyễn Văn Linh', 'Hòa Phường', 'Ngũ Hành Sơn', 'Đà Nẵng', 'Đà Nẵng', 16.0678, 108.2448, '0901234567', '10:00:00', '21:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier2@alibabafood.com'), 'Bánh Mì Việt B', 3, '456 Võ Nguyên Giáp', 'Hòa Phường', 'Ngũ Hành Sơn', 'Đà Nẵng', 'Đà Nẵng', 16.0685, 108.2455, '0902345678', '06:00:00', '18:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier3@alibabafood.com'), 'Cà Phê Góc Phố C', 2, '789 Trường Sa', 'Hòa Phường', 'Ngũ Hành Sơn', 'Đà Nẵng', 'Đà Nẵng', 16.0692, 108.2462, '0903456789', '07:00:00', '22:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier4@alibabafood.com'), 'Nhà Hàng Hải Sản D', 1, '321 Lê Văn Duyệt', 'Hòa Phường', 'Ngũ Hành Sơn', 'Đà Nẵng', 'Đà Nẵng', 16.0699, 108.2469, '0904567890', '11:00:00', '22:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier5@alibabafood.com'), 'Tiệm Bánh Ngọt E', 4, '654 Hoàng Sa', 'Hòa Phường', 'Ngũ Hành Sơn', 'Đà Nẵng', 'Đà Nẵng', 16.0706, 108.2476, '0905678901', '08:00:00', '20:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com'), 'Shop Thực Phẩm F', 1, '789 Hoàng Diệu', 'Hòa Phường', 'Ngũ Hành Sơn', 'Đà Nẵng', 'Đà Nẵng', 16.0714, 108.2483, '0906789012', '09:00:00', '21:00:00');

-- Insert food items
INSERT INTO food_items (supplier_id, product_type_id, category_id, item_name, description, quantity_available, original_price, discounted_price, discount_percentage, food_status_id, preparation_time, safe_consumption_time, expiry_time, pickup_start_time, pickup_end_time, is_pre_order, weight_kg, calories, allergens, ingredients, storage_instructions, reheating_instructions) VALUES
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier1@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Rice dishes'), 'Cơm gà xối mỡ', 'Cơm gà vàng óng, da giòn, thịt mềm', 10, 45000, 25000, 44.44, (SELECT status_id FROM food_statuses WHERE status_name = 'hot'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hour', CURRENT_TIMESTAMP + INTERVAL '3 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hour', TRUE, 1.0, 350, 'chicken', 'Gà, cơm, nước sốt', 'Để trong tủ lạnh', 'Hâm nóng trong lò vi sóng 2 phút'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier1@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Rice dishes'), 'Cơm sườn bò chả', 'Cơm sườn bò nướng, chả giò, trứng ốp la', 8, 50000, 30000, 40.00, (SELECT status_id FROM food_statuses WHERE status_name = 'hot'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hour', CURRENT_TIMESTAMP + INTERVAL '3 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hour', TRUE, 1.2, 450, 'pork,egg', 'Sườn bò, chả giò, trứng', 'Để trong tủ lạnh', 'Hâm nóng trong lò vi sóng 3 phút'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier2@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Bread'), 'Bánh mì thịt nướng', 'Bánh mì thịt nướng, đồ chua, rau thơm', 15, 25000, 15000, 40.00, (SELECT status_id FROM food_statuses WHERE status_name = 'hot'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '2 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 hour', TRUE, 0.3, 280, 'pork', 'Thịt heo, bánh mì, đồ chua', 'Để ở nhiệt độ phòng', 'Hâm nóng trong lò vi sóng 1 phút'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier3@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Drinks'), 'Trà sữa trân châu', 'Trà sữa đậm đà, trân châu dai', 20, 30000, 18000, 40.00, (SELECT status_id FROM food_statuses WHERE status_name = 'cold'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '4 hour', CURRENT_TIMESTAMP + INTERVAL '6 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '4 hour', TRUE, 0.5, 150, 'dairy', 'Trà, sữa, trân châu', 'Để trong tủ lạnh', 'Uống lạnh, không cần hâm nóng'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier3@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Drinks'), 'Cà phê sữa đá', 'Cà phê đậm đà, sữa đặc, đá', 25, 20000, 12000, 40.00, (SELECT status_id FROM food_statuses WHERE status_name = 'cold'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 hour', CURRENT_TIMESTAMP + INTERVAL '5 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 hour', TRUE, 0.3, 80, 'dairy,caffeine', 'Cà phê, sữa, đá', 'Để trong tủ lạnh', 'Uống lạnh, không cần hâm nóng'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier4@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Meat & Seafood'), 'Cá kho tộ', 'Cá kho tộ thơm ngon, thịt cá mềm', 12, 60000, 35000, 41.67, (SELECT status_id FROM food_statuses WHERE status_name = 'hot'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 hour', CURRENT_TIMESTAMP + INTERVAL '5 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 hour', TRUE, 0.8, 400, 'fish', 'Cá, nước mắm, tiêu', 'Để trong tủ lạnh', 'Hâm nóng trong lò vi sóng 3 phút'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier4@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Meat & Seafood'), 'Tẩm hấp bia', 'Tẩm hấp bia thơm ngon, thịt mềm', 10, 70000, 40000, 42.86, (SELECT status_id FROM food_statuses WHERE status_name = 'hot'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 hour', CURRENT_TIMESTAMP + INTERVAL '5 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 hour', TRUE, 1.0, 500, 'pork,alcohol', 'Thịt heo, bia, gia vị', 'Để trong tủ lạnh', 'Hâm nóng trong lò vi sóng 3 phút'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier1@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Rice dishes'), 'Cơm tấm sườn bò', 'Cơm tấm sườn bò nướng, bì, chả', 8, 55000, 32000, 41.82, (SELECT status_id FROM food_statuses WHERE status_name = 'hot'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hour', CURRENT_TIMESTAMP + INTERVAL '3 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hour', TRUE, 1.1, 420, 'pork', 'Cơm tấm, sườn bò, bì, chả', 'Để trong tủ lạnh', 'Hâm nóng trong lò vi sóng 3 phút'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier5@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), 'Bánh flan', 'Bánh flan caramel mềm mịn', 15, 20000, 12000, 40.00, (SELECT status_id FROM food_statuses WHERE status_name = 'cold'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '4 hour', CURRENT_TIMESTAMP + INTERVAL '6 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '4 hour', TRUE, 0.2, 180, 'dairy,eggs', 'Trái gà, sữa, caramel', 'Để trong tủ lạnh', 'Uống lạnh, không cần hâm nóng'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_cooked'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), 'Combo Đặc Biệt F', 'Combo tối với nhiều món ngon, phù hợp supplier mới', 20, 100000, 75000, 25.00, (SELECT status_id FROM food_statuses WHERE status_name = 'hot'),
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hour', CURRENT_TIMESTAMP + INTERVAL '5 hour',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hour', TRUE, 1.0, 550, 'pork,dairy', 'Thịt, rau, gia vị', 'Để trong tủ lạnh', 'Hâm nóng trong lò vi sóng 4 phút');

-- Insert food item images
INSERT INTO food_item_images (item_id, image_url, is_primary) VALUES
((SELECT item_id FROM food_items WHERE item_name = 'Cơm gà xối mỡ'), 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Cơm sườn bò chả'), 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Bánh mì thịt nướng'), 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Trà sữa trân châu'), 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Cà phê sữa đá'), 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Cá kho tộ'), 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Tẩm hấp bia'), 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Cơm tấm sườn bò'), 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Bánh flan'), 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400', TRUE),
((SELECT item_id FROM food_items WHERE item_name = 'Combo Đặc Biệt F'), 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', TRUE);

-- Insert supplier-specific metadata
INSERT INTO supplier_special_hours (supplier_id, date, opening_time, closing_time, is_closed, reason) VALUES
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), CURRENT_DATE, '09:00:00', '21:00:00', FALSE, 'Giờ mở cửa thường xuyên'),
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), CURRENT_DATE + INTERVAL '1 day', '09:00:00', '21:00:00', FALSE, 'Giờ mở cửa ngày mai');

INSERT INTO supplier_verification_documents (supplier_id, document_type, document_url, document_number, issue_date, expiry_date, status, notes) VALUES
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), 'business_license', 'https://example.com/docs/supplier6-license.pdf', 'BL-F-2026-006', (CURRENT_TIMESTAMP - INTERVAL '12 month')::DATE, (CURRENT_TIMESTAMP + INTERVAL '1 year')::DATE, 'verified', 'Đã xác minh giấy phép kinh doanh');

INSERT INTO supplier_violations (supplier_id, violation_type, description, severity, reported_by, is_resolved, notes) VALUES
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), 'late_delivery', 'Giao hàng trễ quá 30 phút', 'medium', NULL, TRUE, 'Đã xử lý và rút kinh nghiệm');

-- Insert order statuses
INSERT INTO order_statuses (status_name, status_name_vi, description) VALUES
('pending', 'Đang chờ', 'Đơn hàng đang chờ xử lý'),
('confirmed', 'Đã xác nhận', 'Đơn hàng đã được nhà cung cấp xác nhận'),
('preparing', 'Đang chuẩn bị', 'Đơn hàng đang được chuẩn bị'),
('ready', 'Sẵn sàng', 'Đơn hàng đã sẵn sàng để lấy'),
('picked_up', 'Đã lấy', 'Khách hàng đã lấy đơn hàng'),
('completed', 'Hoàn thành', 'Đơn hàng đã hoàn thành'),
('cancelled', 'Đã hủy', 'Đơn hàng đã bị hủy'),
('refunded', 'Đã hoàn tiền', 'Đơn hàng đã được hoàn tiền');

-- Insert permissions
INSERT INTO permissions (permission_name, description) VALUES
('user.read', 'Đọc thông tin người dùng'),
('user.write', 'Sửa thông tin người dùng'),
('user.delete', 'Xóa người dùng'),
('supplier.read', 'Đọc thông tin nhà cung cấp'),
('supplier.write', 'Sửa thông tin nhà cung cấp'),
('supplier.delete', 'Xóa nhà cung cấp'),
('product.read', 'Đọc thông tin sản phẩm'),
('product.write', 'Sửa thông tin sản phẩm'),
('product.delete', 'Xóa sản phẩm'),
('order.read', 'Đọc thông tin đơn hàng'),
('order.write', 'Sửa thông tin đơn hàng'),
('order.delete', 'Xóa đơn hàng'),
('admin.full', 'Quyền quản trị viên đầy đủ');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('app_name', 'AlibabaFood', 'Tên ứng dụng', TRUE),
('app_version', '1.0.0', 'Version ứng dụng', TRUE),
('default_currency', 'VND', 'Loại tiền tệ mặc định', TRUE),
('max_distance_km', '50', 'Khoảng cách tối đa cho giao hàng (km)', FALSE),
('min_order_amount', '0', 'Số tiền tối thiểu cho đơn hàng', TRUE),
('enable_notifications', 'true', 'Bật thông báo', FALSE),
('maintenance_mode', 'false', 'Chế độ bảo trì', FALSE),
('support_email', 'support@alibabafood.com', 'Email hỗ trợ', TRUE),
('support_phone', '19001234', 'Số điện thoại hỗ trợ', TRUE),
('social_facebook', 'https://facebook.com/alibabafood', 'Facebook', TRUE),
('social_instagram', 'https://instagram.com/alibabafood', 'Instagram', TRUE),
('social_twitter', 'https://twitter.com/alibabafood', 'Twitter', TRUE);

-- Insert user_impact_stats
INSERT INTO user_impact_stats (user_id, total_orders, total_spent, total_food_saved_kg, total_discount_saved, carbon_footprint_saved_kg)
SELECT user_id, 0, 0, 0, 0, 0 FROM users;

-- Insert supplier_impact_stats
INSERT INTO supplier_impact_stats (supplier_id, total_orders, total_revenue, total_food_saved_kg, total_discount_given, average_rating, carbon_footprint_saved_kg)
SELECT supplier_id, 0, 0, 0, 0, 0, 0 FROM suppliers;

-- Insert system_impact_stats
INSERT INTO system_impact_stats (stat_date, total_orders, total_users, total_suppliers, total_food_saved_kg, total_discount_given, carbon_footprint_saved_kg)
VALUES (CURRENT_DATE, 0, 1, 6, 0, 0, 0);

-- Insert roll credits cho user dauboqu1ay@gmail.com
DO $$
DECLARE
    v_user_id INT;
BEGIN
    SELECT user_id INTO v_user_id FROM users WHERE email = 'dauboqu1ay@gmail.com';
    
    IF v_user_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM roll_credits WHERE user_id = v_user_id) THEN
            INSERT INTO roll_credits (user_id, credits) VALUES (v_user_id, 10);
        ELSE
            UPDATE roll_credits SET credits = credits + 10, updated_at = CURRENT_TIMESTAMP WHERE user_id = v_user_id;
        END IF;
    END IF;
END $$;
