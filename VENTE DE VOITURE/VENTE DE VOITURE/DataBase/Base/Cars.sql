
-- Create database
CREATE DATABASE IF NOT EXISTS luxury_supercars;
USE luxury_supercars;

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    year INT NOT NULL,
    fuel_type ENUM('Petrol', 'Hybrid', 'Electric') NOT NULL,
    mileage INT DEFAULT 0,
    horsepower INT DEFAULT 0,
    top_speed INT DEFAULT 0,
    acceleration VARCHAR(20) DEFAULT NULL,
    gallery JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Test drive requests table
CREATE TABLE IF NOT EXISTS test_drive_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    car_id INT NOT NULL,
    preferred_date DATE NOT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    newsletter BOOLEAN DEFAULT FALSE,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data

-- Sample cars
INSERT INTO cars (brand, model, price, image, description, year, fuel_type, mileage, horsepower, top_speed, acceleration, gallery) VALUES
('Ferrari', 'SF90 Stradale', 625000.00, 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg', 'The SF90 Stradale is Ferrari\'s first series-production plug-in hybrid supercar, combining a twin-turbo V8 with three electric motors.', 2024, 'Hybrid', 0, 986, 211, '2.5s 0-60mph', '["https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg", "https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg"]'),

('Lamborghini', 'Revuelto', 598000.00, 'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg', 'The Revuelto is Lamborghini\'s first V12 hybrid super sports car, combining naturally aspirated V12 with hybrid technology.', 2024, 'Hybrid', 0, 1001, 217, '2.5s 0-60mph', '["https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg", "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg"]'),

('McLaren', '720S', 315000.00, 'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg', 'The McLaren 720S is a pinnacle of supercar engineering, featuring carbon fiber construction and active aerodynamics.', 2023, 'Petrol', 2500, 710, 212, '2.8s 0-60mph', '["https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg", "https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg"]'),

('Rolls-Royce', 'Cullinan', 395000.00, 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg', 'The Cullinan is Rolls-Royce\'s first SUV, combining luxury with all-terrain capability and the finest materials.', 2024, 'Petrol', 0, 563, 155, '5.2s 0-60mph', '["https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg"]'),

('Porsche', '911 Turbo S', 230000.00, 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg', 'The 911 Turbo S represents the pinnacle of Porsche performance, combining heritage with cutting-edge technology.', 2024, 'Petrol', 0, 640, 205, '2.6s 0-60mph', '["https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg", "https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg"]'),

('Bugatti', 'Chiron', 3200000.00, 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg', 'The Chiron is the ultimate expression of automotive luxury and performance, with an 8.0L quad-turbo W16 engine.', 2023, 'Petrol', 1200, 1479, 261, '2.4s 0-60mph', '["https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg", "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"]');

-- Sample admin user (password: admin123 - should be hashed in production)
INSERT INTO admin_users (username, password, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@luxurysupercars.com');

-- Create indexes 
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_test_drive_requests_car_id ON test_drive_requests(car_id);
CREATE INDEX idx_test_drive_requests_date ON test_drive_requests(preferred_date);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_date ON contact_messages(created_at);