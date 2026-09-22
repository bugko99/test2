CREATE DATABASE IF NOT EXISTS `game_trading_db`;
USE `game_trading_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `seller_id` INT NOT NULL,
  `game_name` VARCHAR(100) NOT NULL,
  `account_details` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `status` ENUM('available', 'sold', 'pending') DEFAULT 'available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`)
);

-- Insert dummy data
INSERT IGNORE INTO `users` (`username`, `email`, `password_hash`) VALUES
('test_seller', 'seller@test.com', 'hashedpassword123');

INSERT IGNORE INTO `accounts` (`seller_id`, `game_name`, `account_details`, `price`) VALUES
(1, 'Valorant', 'Immortal Rank, 100+ Skins', 150.00),
(1, 'Genshin Impact', 'AR60, 20x 5-star characters', 200.00);
