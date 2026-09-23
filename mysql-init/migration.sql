USE `game_trading_db`;

ALTER TABLE users MODIFY COLUMN role ENUM('user', 'seller', 'admin') DEFAULT 'user';
ALTER TABLE users ADD COLUMN balance DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE accounts ADD COLUMN category VARCHAR(100) AFTER game_name;
ALTER TABLE accounts ADD COLUMN image_url VARCHAR(255) AFTER category;

UPDATE accounts SET category = 'fps' WHERE game_name = 'Valorant';
UPDATE accounts SET category = 'rpg' WHERE game_name = 'Genshin Impact';

CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `buyer_id` INT NOT NULL,
  `seller_id` INT NOT NULL,
  `account_id` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`)
);

CREATE TABLE IF NOT EXISTS `withdrawals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `account_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`)
);
