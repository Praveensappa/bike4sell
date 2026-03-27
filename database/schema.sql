CREATE DATABASE IF NOT EXISTS dj_booking;
USE dj_booking;

SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  mobile VARCHAR(15) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  otp_verified TINYINT(1) NOT NULL DEFAULT 0,
  role ENUM('CUSTOMER','DJ','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  status ENUM('ACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE djs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  stage_name VARCHAR(120) NOT NULL,
  location VARCHAR(120) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  is_approved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_djs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_djs_base_price CHECK (base_price >= 0),
  CONSTRAINT chk_djs_avg_rating CHECK (avg_rating >= 0 AND avg_rating <= 5)
);

CREATE TABLE dj_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dj_id INT NOT NULL UNIQUE,
  bio TEXT,
  experience_years INT NOT NULL DEFAULT 0,
  genres_json JSON NOT NULL,
  images_json JSON NULL,
  videos_json JSON NULL,
  packages_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dj_profiles_dj FOREIGN KEY (dj_id) REFERENCES djs(id) ON DELETE CASCADE,
  CONSTRAINT chk_experience_years CHECK (experience_years >= 0 AND experience_years <= 80)
);

CREATE TABLE availability_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dj_id INT NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  is_booked TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_slots_dj FOREIGN KEY (dj_id) REFERENCES djs(id) ON DELETE CASCADE,
  CONSTRAINT chk_slot_window CHECK (end_at > start_at),
  UNIQUE KEY uk_slot_unique (dj_id, start_at, end_at)
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  dj_id INT NOT NULL,
  event_type ENUM('WEDDING','PARTY','CORPORATE') NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  quoted_price DECIMAL(10,2) NOT NULL,
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES users(id),
  CONSTRAINT fk_bookings_dj FOREIGN KEY (dj_id) REFERENCES djs(id),
  CONSTRAINT chk_booking_window CHECK (end_at > start_at),
  CONSTRAINT chk_booking_price CHECK (quoted_price >= 0)
);

CREATE TABLE booking_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  status ENUM('REQUESTED','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL,
  remarks VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_status_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('ADVANCE','FULL') NOT NULL,
  status ENUM('INITIATED','SUCCESS','FAILED') NOT NULL,
  failure_reason VARCHAR(255) NULL,
  provider_txn_id VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT chk_payment_amount CHECK (amount >= 0),
  UNIQUE KEY uk_provider_txn (provider_txn_id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL UNIQUE,
  dj_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  moderation_status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  moderation_reason VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_dj FOREIGN KEY (dj_id) REFERENCES djs(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_review_rating CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX idx_djs_search ON djs (location, base_price, avg_rating, is_approved);
CREATE INDEX idx_bookings_dj_time ON bookings (dj_id, start_at, end_at);
CREATE INDEX idx_slots_dj_time ON availability_slots (dj_id, start_at, end_at, is_booked);
