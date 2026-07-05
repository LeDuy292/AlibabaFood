-- =====================================================
-- ALIBABA FOOD - DATABASE DESIGN (SQL SERVER)
-- Khu vực: Hòa Phường, Ngũ Hành Sơn, Đà Nẵng, Việt Nam
-- =====================================================

-- =====================================================
-- QUẢN LÝ NGƯỜI DÙNG (USERS MANAGEMENT)
-- =====================================================

-- Bảng vai trò người dùng
CREATE TABLE roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng người dùng chính
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    username NVARCHAR(100) NOT NULL UNIQUE,
    phone NVARCHAR(20),
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    avatar_url NVARCHAR(500),
    role_id INT NOT NULL,
    is_verified BIT DEFAULT 0,
    is_active BIT DEFAULT 1,
    last_login DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Bảng roll credits cho Mystery Bag
CREATE TABLE RollCredits (
    credit_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    credits INT NOT NULL DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng địa chỉ người dùng
CREATE TABLE user_addresses (
    address_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    address_type NVARCHAR(20),
    address_line1 NVARCHAR(500) NOT NULL,
    address_line2 NVARCHAR(500),
    ward NVARCHAR(100),
    district NVARCHAR(100),
    city NVARCHAR(100) NOT NULL,
    province NVARCHAR(100) NOT NULL,
    postal_code NVARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng thông báo người dùng
CREATE TABLE user_notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    notification_type NVARCHAR(50),
    is_read BIT DEFAULT 0,
    related_id INT,
    related_type NVARCHAR(50),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================================================
-- QUẢN LÝ NHÀ CUNG CẤP (SUPPLIER MANAGEMENT)
-- =====================================================

-- Bảng loại hình kinh doanh
CREATE TABLE business_types (
    business_type_id INT IDENTITY(1,1) PRIMARY KEY,
    type_name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng nhà cung cấp/cửa hàng
CREATE TABLE suppliers (
    supplier_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    business_name NVARCHAR(255) NOT NULL,
    business_type_id INT NOT NULL,
    business_registration_number NVARCHAR(100),
    tax_code NVARCHAR(50),
    logo_url NVARCHAR(500),
    cover_image_url NVARCHAR(500),
    description NVARCHAR(MAX),
    address_line1 NVARCHAR(500) NOT NULL,
    address_line2 NVARCHAR(500),
    ward NVARCHAR(100),
    district NVARCHAR(100),
    city NVARCHAR(100) NOT NULL,
    province NVARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone NVARCHAR(20) NOT NULL,
    email NVARCHAR(255),
    website NVARCHAR(255),
    opening_time TIME,
    closing_time TIME,
    is_verified BIT DEFAULT 0,
    verification_date DATETIME2,
    is_active BIT DEFAULT 1,
    rating_average DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_food_saved_kg DECIMAL(10, 2) DEFAULT 0.00,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (business_type_id) REFERENCES business_types(business_type_id)
);

-- =====================================================
-- QUẢN LÝ DANH MỤC THỰC PHẨM (FOOD CATEGORIES)
-- =====================================================

-- Bảng danh mục thực phẩm
CREATE TABLE food_categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    parent_category_id INT,
    category_name NVARCHAR(100) NOT NULL,
    category_name_en NVARCHAR(100),
    description NVARCHAR(MAX),
    icon_url NVARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng nhu cầu ăn uống (dietary preferences)
CREATE TABLE dietary_preferences (
    preference_id INT IDENTITY(1,1) PRIMARY KEY,
    preference_name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    icon_url NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- =====================================================
-- QUẢN LÝ SẢN PHẨM THỰC PHẨM (FOOD ITEMS)
-- =====================================================

-- Bảng loại sản phẩm
CREATE TABLE product_types (
    product_type_id INT IDENTITY(1,1) PRIMARY KEY,
    type_name NVARCHAR(50) NOT NULL UNIQUE,
    type_name_vi NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng trạng thái thực phẩm
CREATE TABLE food_statuses (
    status_id INT IDENTITY(1,1) PRIMARY KEY,
    status_name NVARCHAR(50) NOT NULL UNIQUE,
    status_name_vi NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    storage_instruction NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng sản phẩm thực phẩm
CREATE TABLE food_items (
    item_id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id INT NOT NULL,
    product_type_id INT NOT NULL,
    category_id INT NOT NULL,
    item_name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    is_surprise_bag BIT DEFAULT 0,
    quantity_available INT NOT NULL DEFAULT 0,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    food_status_id INT NOT NULL,
    preparation_time DATETIME2 NOT NULL,
    safe_consumption_time DATETIME2 NOT NULL,
    expiry_time DATETIME2 NOT NULL,
    pickup_start_time DATETIME2,
    pickup_end_time DATETIME2,
    is_pre_order BIT DEFAULT 0,
    weight_kg DECIMAL(8, 3),
    calories INT,
    allergens NVARCHAR(MAX),
    ingredients NVARCHAR(MAX),
    storage_instructions NVARCHAR(MAX),
    reheating_instructions NVARCHAR(MAX),
    is_active BIT DEFAULT 1,
    is_approved BIT DEFAULT 0,
    approved_by INT,
    approved_at DATETIME2,
    total_sold INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (product_type_id) REFERENCES product_types(product_type_id),
    FOREIGN KEY (category_id) REFERENCES food_categories(category_id),
    FOREIGN KEY (food_status_id) REFERENCES food_statuses(status_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- Bảng hình ảnh sản phẩm
CREATE TABLE food_item_images (
    image_id INT IDENTITY(1,1) PRIMARY KEY,
    item_id INT NOT NULL,
    image_url NVARCHAR(500) NOT NULL,
    is_primary BIT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE CASCADE
);

-- =====================================================
-- AUTHENTICATION TABLES
-- =====================================================

-- Bảng lịch sử đăng nhập
CREATE TABLE login_history (
    history_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    email NVARCHAR(255) NOT NULL,
    login_time DATETIME2 DEFAULT GETDATE(),
    ip_address NVARCHAR(50),
    user_agent NVARCHAR(500),
    is_successful BIT DEFAULT 1,
    failure_reason NVARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng phiên người dùng
CREATE TABLE user_sessions (
    session_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    session_token NVARCHAR(2048) NOT NULL UNIQUE,
    refresh_token NVARCHAR(2048),
    device_info NVARCHAR(500),
    ip_address NVARCHAR(50),
    user_agent NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETDATE(),
    expires_at DATETIME2 NOT NULL,
    is_active BIT DEFAULT 1,
    last_activity DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================================================
-- ĐƠN HÀNG THANH TOÁN PAYOS
-- =====================================================

-- Bảng đơn hàng PayOS
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id INT NULL,
    user_id INT NULL,
    order_code BIGINT NOT NULL UNIQUE,
    status NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount INT NOT NULL,
    description NVARCHAR(255) NOT NULL,
    buyer_name NVARCHAR(255) NOT NULL,
    buyer_email NVARCHAR(255),
    buyer_phone NVARCHAR(20),
    buyer_address NVARCHAR(500),
    payment_link_id NVARCHAR(500),
    checkout_url NVARCHAR(1000),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    item_name NVARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- =====================================================
-- CỘNG ĐỒNG & ĐÁNH GIÁ (COMMUNITY & REVIEWS)
-- =====================================================

-- Bảng bài viết cộng đồng
CREATE TABLE community_posts (
    post_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    image_url NVARCHAR(500),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng bình luận cộng đồng
CREATE TABLE community_comments (
    comment_id INT IDENTITY(1,1) PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (post_id) REFERENCES community_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE NO ACTION
);

-- Bảng đánh giá sản phẩm
CREATE TABLE product_reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
);

-- Bảng đánh giá cửa hàng
CREATE TABLE supplier_reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    rating_food INT NOT NULL CHECK (rating_food BETWEEN 1 AND 5),
    rating_accuracy INT NOT NULL CHECK (rating_accuracy BETWEEN 1 AND 5),
    rating_service INT NOT NULL CHECK (rating_service BETWEEN 1 AND 5),
    rating_speed INT NOT NULL CHECK (rating_speed BETWEEN 1 AND 5),
    comment NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION
);

-- Bảng phản hồi và góp ý
CREATE TABLE user_feedbacks (
    feedback_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    feedback_type NVARCHAR(50) NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng báo cáo vi phạm
CREATE TABLE violation_reports (
    report_id INT IDENTITY(1,1) PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_supplier_id INT,
    reported_item_id INT,
    report_type NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending',
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_supplier_id) REFERENCES suppliers(supplier_id) ON DELETE NO ACTION,
    FOREIGN KEY (reported_item_id) REFERENCES food_items(item_id) ON DELETE NO ACTION
);

-- =====================================================
-- INSERT SAMPLE DATA (SEED DATA)
-- =====================================================

-- Insert roles trước
INSERT INTO roles (role_name, description) VALUES
(N'customer', N'Khách hàng'),
(N'supplier', N'Nhà cung cấp'),
(N'admin', N'Quản trị viên'),
(N'moderator', N'Người kiểm duyệt');

-- Insert users (sử dụng subquery tìm role_id)
INSERT INTO users (email, username, password_hash, full_name, phone, role_id) VALUES
('supplier1@alibabafood.com', 'supplier1', 'hashed_password_1', N'Nguyễn Văn A', '0901234567', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier2@alibabafood.com', 'supplier2', 'hashed_password_2', N'Trần Thị B', '0902345678', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier3@alibabafood.com', 'supplier3', 'hashed_password_3', N'Lê Văn C', '0903456789', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier4@alibabafood.com', 'supplier4', 'hashed_password_4', N'Phạm Thị D', '0904567890', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier5@alibabafood.com', 'supplier5', 'hashed_password_5', N'Hoàng Văn E', '0905678901', (SELECT role_id FROM roles WHERE role_name = 'supplier')),
('supplier6@alibabafood.com', 'supplier6', 'hashed_password_6', N'Nguyễn Thị F', '0906789012', (SELECT role_id FROM roles WHERE role_name = 'supplier'));

-- Insert business types
INSERT INTO business_types (type_name, description) VALUES
(N'restaurant', N'Nhà hàng'),
(N'cafe', N'Quán cà phê'),
(N'supermarket', N'Siêu thị'),
(N'bakery', N'Tiệm bánh');

-- Insert product types
INSERT INTO product_types (type_name, type_name_vi, description) VALUES
('specific_cooked', N'Cooked specific', N'Món ăn cụ thể đã nấu'),
('surprise_bag_cooked', N'Cooked surprise bag', N'Túi bất ngờ món ăn đã nấu'),
('specific_raw', N'Raw specific', N'Nguyên liệu cụ thể chưa chế biến'),
('surprise_bag_raw', N'Raw surprise bag', N'Túi bất ngờ nguyên liệu chưa chế biến');

-- Insert food statuses
INSERT INTO food_statuses (status_name, status_name_vi, description) VALUES
(N'hot', N'Nóng', N'Món ăn nóng'),
(N'cold', N'Lạnh', N'Món ăn lạnh'),
(N'fresh', N'Tươi', N'Ăn tươi'),
(N'frozen', N'Đông lạnh', N'Món ăn đông lạnh'),
(N'packaged', N'Đóng gói', N'Món ăn đã đóng gói');

-- Insert food categories
INSERT INTO food_categories (category_name, category_name_en, description) VALUES
(N'Cơm', 'Rice dishes', N'Các món cơm'),
(N'Bánh mì', 'Bread', N'Các loại bánh mì'),
(N'Đồ uống', 'Drinks', N'Các loại đồ uống'),
(N'Thịt & Hải sản', 'Meat & Seafood', N'Các món thịt và hải sản'),
(N'Bánh ngọt', 'Pastries', N'Các loại bánh ngọt');

-- Insert dietary preferences
INSERT INTO dietary_preferences (preference_name, description) VALUES
(N'vegetarian', N'Chay'),
(N'vegan', N'Chay thuần túy'),
(N'halal', N'Halal'),
(N'gluten_free', N'Không gluten');

-- Insert suppliers (Mart/Bách Hóa Xanh)
INSERT INTO suppliers (user_id, business_name, business_type_id, address_line1, ward, district, city, province, latitude, longitude, phone, opening_time, closing_time) VALUES
((SELECT user_id FROM users WHERE email = 'supplier1@alibabafood.com'), N'WinMart Hòa Phường', 3, N'123 Nguyễn Văn Linh', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0678, 108.2448, '0901234567', '07:00:00', '22:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier2@alibabafood.com'), N'Bách Hóa Xanh Võ Nguyên Giáp', 3, N'456 Võ Nguyên Giáp', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0685, 108.2455, '0902345678', '06:00:00', '22:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier3@alibabafood.com'), N'WinMart+ Trường Sa', 3, N'789 Trường Sa', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0692, 108.2462, '0903456789', '07:00:00', '22:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier4@alibabafood.com'), N'Co.opmart Lê Văn Duyệt', 3, N'321 Lê Văn Duyệt', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0699, 108.2469, '0904567890', '07:00:00', '22:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier5@alibabafood.com'), N'Lotte Mart Hoàng Sa', 3, N'654 Hoàng Sa', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0706, 108.2476, '0905678901', '08:00:00', '22:00:00'),
((SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com'), N'GO! Mall Hoàng Diệu', 3, N'789 Hoàng Diệu', N'Hòa Phường', N'Ngũ Hành Sơn', N'Đà Nẵng', N'Đà Nẵng', 16.0714, 108.2483, '0906789012', '08:00:00', '22:00:00');

-- Insert food items (Sản phẩm Snack/Hạt từ Mart)
INSERT INTO food_items (supplier_id, product_type_id, category_id, item_name, description, quantity_available, original_price, discounted_price, discount_percentage, food_status_id, preparation_time, safe_consumption_time, expiry_time, pickup_start_time, pickup_end_time, is_pre_order, weight_kg, calories, allergens, ingredients, storage_instructions, reheating_instructions) VALUES
-- WinMart Hòa Phường
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier1@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'C&B Chà Bông Heo 80g', N'Chà bông heo 80g', 50, 35000, 22000, 37.14, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.08, 200, N'pork', N'Thịt heo', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier1@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Olala Khô Gà Sạch Chicken Jerky', N'Khô gà sạch vị bơ tỏi 50g, vị lá chanh 50g', 45, 28000, 17000, 39.29, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.05, 180, N'chicken', N'Thịt gà', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier1@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Bumbo Thịt Bò Khô (Dried Beef) 60g', N'Thịt bò khô 60g', 40, 32000, 20000, 37.50, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.06, 220, N'beef', N'Thịt bò', N'Để nơi khô ráo', N'Ăn trực tiếp'),

-- Bách Hóa Xanh Võ Nguyên Giáp
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier2@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Orion Boom Jelly JP! Đào Dẻo Dai', N'Kẹo dẻo đào dẻo dai', 60, 15000, 9000, 40.00, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 365, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.1, 120, N'peach', N'Kẹo dẻo', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier2@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Bà Tư Bình Phước Hạt Điều Tỏi Ớt Đỏ', N'Hạt điều tỏi ớt đỏ', 35, 55000, 34000, 38.18, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.2, 300, N'cashew', N'Hạt điều', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier2@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Martin Hạt Hướng Dương Rang 200g', N'Hạt hướng dương rang 200g', 30, 45000, 28000, 37.78, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.2, 350, N'sunflower', N'Hạt hướng dương', N'Để nơi khô ráo', N'Ăn trực tiếp'),

-- WinMart+ Trường Sa
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier3@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Cheer Talk Hạt Hướng Dương Vị Dừa 130g', N'Hạt hướng dương vị dừa 130g', 40, 38000, 23000, 39.47, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.13, 320, N'sunflower', N'Hạt hướng dương', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier3@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Việt San Đậu Phộng', N'Đậu phộng', 50, 25000, 15000, 40.00, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.15, 280, N'peanut', N'Đậu phộng', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier3@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Việt San Hạt Sen Sấy Khô 150g', N'Hạt sen sấy khô 150g', 35, 42000, 26000, 38.10, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.15, 250, N'lotus', N'Hạt sen', N'Để nơi khô ráo', N'Ăn trực tiếp'),

-- Co.opmart Lê Văn Duyệt
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier4@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Vissan Lạp Xưởng Mai Quế Lộ 200g', N'Lạp xưởng mai quế lộ 200g', 30, 48000, 30000, 37.50, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 60, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.2, 350, N'pork', N'Thịt heo', N'Để trong tủ lạnh', N'Luộc hoặc chiên'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier4@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Drinks'), N'NESCAFÉ Café Sữa Đá', N'Café sữa đá hộp 10 gói', 40, 85000, 52000, 38.82, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 365, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.2, 80, N'dairy,caffeine', N'Cà phê, sữa', N'Để nơi khô ráo', N'Pha với đá'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier4@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Bibigo Rong Biển Không Giòn', N'Rong biển không giòn vị nước tương kiểu Hàn Quốc', 35, 25000, 15000, 40.00, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.03, 50, N'seaweed', N'Rong biển', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier4@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'O Food Rong Biển Giòn', N'Rong biển giòn trộn gia vị', 30, 28000, 17000, 39.29, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.04, 60, N'seaweed', N'Rong biển', N'Để nơi khô ráo', N'Ăn trực tiếp'),

-- Lotte Mart Hoàng Sa
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier5@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Tohogenkai Genkai Rong Biển', N'Rong biển trộn rau củ', 25, 35000, 22000, 37.14, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 180, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.05, 70, N'seaweed', N'Rong biển, rau củ', N'Để trong tủ lạnh', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier5@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Drinks'), N'Vietcoco Premium Organic Coconut Cream', N'Kem dừa organic 400ml', 20, 45000, 28000, 37.78, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 365, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.4, 150, N'coconut', N'Dừa', N'Để trong tủ lạnh', N'Uống trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier5@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Drinks'), N'Tam Mã Trà Hương Sâm Dứa', N'Trà hương sâm dứa', 30, 32000, 20000, 37.50, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 365, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.3, 100, N'ginseng', N'Trà, sâm, dứa', N'Để nơi khô ráo', N'Pha uống'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier5@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Drinks'), N'Trà Bắc Thái Trà Xanh', N'Trà xanh Thái Nguyên đặc sản', 25, 38000, 23000, 39.47, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 365, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.25, 50, N'tea', N'Trà xanh', N'Để nơi khô ráo', N'Pha uống'),

-- GO! Mall Hoàng Diệu
((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Pastries'), N'Wyn Patê Gan Heo', N'Patê gan heo vị nguyên bản 150g', 20, 42000, 26000, 38.10, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 60, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.15, 300, N'pork', N'Gan heo', N'Để trong tủ lạnh', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Meat & Seafood'), N'Cá Ngừ Ngâm Dầu', N'Cá ngừ ngâm dầu (Tuna Chunk in Soya Oil)', 25, 55000, 34000, 38.18, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 365, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.15, 250, N'fish', N'Cá ngừ', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Meat & Seafood'), N'Cá Ngừ Xốt Cay', N'Cá ngừ xốt cay (Tuna Chunk in Tomato Sauce)', 20, 58000, 36000, 37.93, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 365, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.15, 280, N'fish', N'Cá ngừ', N'Để nơi khô ráo', N'Ăn trực tiếp'),

((SELECT supplier_id FROM suppliers WHERE user_id = (SELECT user_id FROM users WHERE email = 'supplier6@alibabafood.com')), (SELECT product_type_id FROM product_types WHERE type_name = 'specific_raw'), (SELECT category_id FROM food_categories WHERE category_name_en = 'Drinks'), N'NESCAFÉ 3 in 1 Vị Nguyên Bản', N'NESCAFÉ 3 in 1 vị nguyên bản hộp 20 gói', 30, 95000, 58000, 38.95, (SELECT status_id FROM food_statuses WHERE status_name = N'packaged'),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), DATEADD(hour, 365, GETDATE()),
 DATEADD(hour, 0, GETDATE()), DATEADD(hour, 30, GETDATE()), 0, 0.3, 80, N'dairy,caffeine', N'Cà phê', N'Để nơi khô ráo', N'Pha uống');

-- Insert food item images (Sản phẩm Snack/Hạt từ Mart)
-- C&B Chà Bông Heo 80g (WinMart Hòa Phường)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Việt San Đậu Phộng'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265865/z7967827104366_0f1daba91dd9859dbbecaa8ecbce3b65_cque02.jpg', 1, 0);

-- Olala Khô Gà Sạch Chicken Jerky (WinMart Hòa Phường)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Việt San Hạt Sen Sấy Khô 150g'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265866/z7967827105223_3cfac59a8a2a41b6b415227fe8834435_br8iv9.jpg', 1, 0);

-- Bumbo Thịt Bò Khô (Dried Beef) 60g (WinMart Hòa Phường)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Vissan Lạp Xưởng Mai Quế Lộ 200g'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265853/z7967827112771_586fb7000d81efa4de8539aa1072999c_mfflbb.jpg', 1, 0);

-- Orion Boom Jelly JP! Đào Dẻo Dai (Bách Hóa Xanh Võ Nguyên Giáp)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'C&B Chà Bông Heo 80g'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265852/z7967827114866_2f474afbf20d4e40927e1096c66a8192_dh8men.jpg', 1, 0);

-- Bà Tư Bình Phước Hạt Điều Tỏi Ớt Đỏ (Bách Hóa Xanh Võ Nguyên Giáp)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Olala Khô Gà Sạch Chicken Jerky'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265853/z7967827121168_1ba9613c163928f531c0cfe5482078ae_fiuc1f.jpg', 1, 0);

-- Martin Hạt Hướng Dương Rang 200g (Bách Hóa Xanh Võ Nguyên Giáp)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Bumbo Thịt Bò Khô (Dried Beef) 60g'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265855/z7967827211201_80ad5a2ea43a7baf760fed7a07722154_lmzvyp.jpg', 1, 0);

-- Cheer Talk Hạt Hướng Dương Vị Dừa 130g (WinMart+ Trường Sa)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Orion Boom Jelly JP! Đào Dẻo Dai'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265856/z7967827211306_0eb8786fd292c4e046cf849f64def384_r9bqoa.jpg', 1, 0);

-- Việt San Đậu Phộng (WinMart+ Trường Sa)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'hạt điều '), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265856/z7967827224323_4a383b9abae4e644f9ad5dd214542eac_k2usgt.jpg', 1, 0);

-- Việt San Hạt Sen Sấy Khô 150g (WinMart+ Trường Sa)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Việt San Hạt Sen Sấy Khô 150g'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265857/z7967827224324_c89e504a16459093db3015c9fe5bd084_isdgv9.jpg', 1, 0);

-- Vissan Lạp Xưởng Mai Quế Lộ 200g (Co.opmart Lê Văn Duyệt)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Vissan Lạp Xưởng Mai Quế Lộ 200g'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265858/z7967827229162_fae6e0f7c93812fcea0ed129cee67d0a_jgbvb8.jpg', 1, 0);

-- NESCAFÉ Café Sữa Đá (Co.opmart Lê Văn Duyệt)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'NESCAFÉ Café Sữa Đá'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265862/z7967827232530_8bc6b7ecf0897491dacdcbea8821e394_gv2cat.jpg', 1, 0);

-- Bibigo Rong Biển Không Giòn (Co.opmart Lê Văn Duyệt)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Bibigo Rong Biển Không Giòn'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265861/z7967827239952_2249453443b58f1cfdd412ca38144dba_slgbty.jpg', 1, 0);

-- O Food Rong Biển Giòn (Co.opmart Lê Văn Duyệt)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'O Food Rong Biển Giòn'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265861/z7967827240531_3e158368902e58c2f795613dddc75364_iwqbd1.jpg', 1, 0);

-- Tohogenkai Genkai Rong Biển (Lotte Mart Hoàng Sa)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Tohogenkai Genkai Rong Biển'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265861/z7967827243546_e63c03ba298b85e1cd254237badc7d9f_qcf47z.jpg', 1, 0);

-- Vietcoco Premium Organic Coconut Cream (Lotte Mart Hoàng Sa)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Vietcoco Premium Organic Coconut Cream'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265863/z7967827251510_8035718cc14bf2fea1d414490716825a_tn9ynw.jpg', 1, 0);

-- Tam Mã Trà Hương Sâm Dứa (Lotte Mart Hoàng Sa)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Tam Mã Trà Hương Sâm Dứa'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265863/z7967827254392_c442f2398c7988276092215de6eec4b3_xrcruk.jpg', 1, 0);

-- Trà Bắc Thái Trà Xanh (Lotte Mart Hoàng Sa)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Trà Bắc Thái Trà Xanh'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265866/z7967827254394_928cccdf88601cc00cb7beb254634460_crqmfz.jpg', 1, 0);

-- Wyn Patê Gan Heo (GO! Mall Hoàng Diệu)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Wyn Patê Gan Heo'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265864/z7967827324613_c302779f42586cbb960f540d5cf89b22_zfcxw7.jpg', 1, 0);

-- Cá Ngừ Ngâm Dầu (GO! Mall Hoàng Diệu)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Cá Ngừ Ngâm Dầu'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265853/z7967827327497_1b411fd514ceeed4f715918944ea8370_vpmncn.jpg', 1, 0);

-- Cá Ngừ Xốt Cay (GO! Mall Hoàng Diệu)
INSERT INTO food_item_images (item_id, image_url, is_primary, display_order) VALUES
((SELECT item_id FROM food_items WHERE item_name = N'Cá Ngừ Xốt Cay'), 'https://res.cloudinary.com/w7jipfqd/image/upload/v1783265853/z7967827331808_8b49aea8bf34ce90cefff81ed07ac2b3_xlx6pe.jpg', 1, 0);

