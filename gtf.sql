-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2025 at 03:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gtf`
--
USE `gtf`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  fname VARCHAR(250) NOT NULL,
  email VARCHAR(250) NOT NULL,
  password VARCHAR(100) NOT NULL,
  role ENUM('chef','admin','user') NOT NULL,
  status ENUM('pending','active') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (id),
  UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO users (fname, email, password, role, status) VALUES
('admin', 'admin@mail.com', '$2y$10$KIseiPQ9ZiTEaatBhPIS5.CHeoho5AgGryaZxxgCXiPp.oa4Jk.vq', 'admin', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE users ADD UNIQUE (email);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE users MODIFY id INT NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE TABLE IF NOT EXISTS notifications (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT notifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Example notification (optional)
-- INSERT INTO notifications (user_id, message) VALUES (1, 'Welcome to the system!');

-- Indexes (redundant if already included above, but safe to repeat)
ALTER TABLE notifications ADD PRIMARY KEY (id);
ALTER TABLE notifications ADD KEY user_id (user_id);

-- Foreign key constraint (redundant if already included above, but safe to repeat)
ALTER TABLE notifications
  ADD CONSTRAINT notifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- Set auto-increment (optional, MySQL usually handles this)
ALTER TABLE notifications MODIFY id INT NOT NULL AUTO_INCREMENT;
