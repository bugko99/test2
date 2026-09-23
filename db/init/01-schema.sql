-- 01-schema.sql
-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS `bugkoshop_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bugkoshop_db`;

-- 1. agencies (Master Data)
CREATE TABLE IF NOT EXISTS `agencies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. users (Master Data)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` ENUM('super_admin', 'dcms_staff', 'dcms_head', 'agency_officer', 'executive') NOT NULL,
  `agency_id` INT DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON DELETE SET NULL
);

-- 3. complaint_categories (Master Data)
CREATE TABLE IF NOT EXISTS `complaint_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `default_sla_days` INT NOT NULL DEFAULT 15,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. complainants (Transaction Data)
CREATE TABLE IF NOT EXISTS `complainants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_card_number` VARCHAR(20) DEFAULT NULL,
  `first_name` VARCHAR(100) DEFAULT NULL,
  `last_name` VARCHAR(100) DEFAULT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `is_anonymous` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. complaints (Transaction Data - Core)
CREATE TABLE IF NOT EXISTS `complaints` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tracking_number` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `incident_date` DATE DEFAULT NULL,
  `incident_location` TEXT DEFAULT NULL,
  `source_channel` ENUM('in-person', 'phone', 'letter', 'web', 'api') DEFAULT 'web',
  `status` ENUM('NEW', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_INFO', 'RESOLVED', 'CLOSED', 'REJECTED') DEFAULT 'NEW',
  `sla_due_date` DATE DEFAULT NULL,
  `complainant_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `assigned_agency_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`complainant_id`) REFERENCES `complainants`(`id`),
  FOREIGN KEY (`category_id`) REFERENCES `complaint_categories`(`id`),
  FOREIGN KEY (`assigned_agency_id`) REFERENCES `agencies`(`id`)
);

-- 6. complaint_attachments (Transaction Data)
CREATE TABLE IF NOT EXISTS `complaint_attachments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `complaint_id` INT NOT NULL,
  `uploaded_by` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`),
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`)
);

-- 7. complaint_status_logs (Log/History Data)
CREATE TABLE IF NOT EXISTS `complaint_status_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `complaint_id` INT NOT NULL,
  `changed_by` INT NOT NULL,
  `old_status` VARCHAR(50) DEFAULT NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `remark` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`),
  FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`)
);

-- 8. complaint_comments (Log/History Data)
CREATE TABLE IF NOT EXISTS `complaint_comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `complaint_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `comment_text` TEXT NOT NULL,
  `is_internal` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
