-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2025 at 04:30 AM
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
CREATE DATABASE IF NOT EXISTS `gtf` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gtf`;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(14, 9, 'New user registration: dsd (boukrayounes69@gmail.com)', 0, '2025-05-13 01:10:51'),
(17, 9, 'New user registration: boukra younes (boukrayounes@gmail.com)', 0, '2025-05-13 01:39:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fname` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('chef','admin','user') NOT NULL,
  `status` enum('pending','active') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `email`, `password`, `role`, `status`) VALUES
(5, 'tima ', 'tima@mail.com', '$2y$10$enfNf58V3VIw/27d1URkaOYhzyT7YJpYF2BeJrOhAhnq.OaiPjGfa', 'admin', 'active'),
(6, 'test', 'test@mail.com', '$2y$10$3l14lh5c/NNVQpsSlD.KK.9S3eXa598uM1qD5F4lQEzl58bERXUE.', 'admin', 'active'),
(7, 'test', 'test5888@mail.com', '$2y$10$GI.TCF3Ls0t6r.0PJ5ap.esSdiRsePCqRzfCC81vYjvsFKed//rlO', 'chef', 'active'),
(9, 'tima benchenina', 'tima2@mail.com', '$2y$10$enfNf58V3VIw/27d1URkaOYhzyT7YJpYF2BeJrOhAhnq.OaiPjGfa', 'admin', 'active'),
(10, 'dsd', 'boukrayounes69@gmail.com', '$2y$10$QNxzmJma3T0NZsTdKok2.Op2b07TAdwrPB9DeNsf9Z0ebEhAcxKJC', 'chef', 'active'),
(11, 'boukra younes', 'boukrayounes@gmail.com', '$2y$10$EWiLdQYR7zLFR5K9CCFpre7XtZHH9BMdeRYMyhwhuGN2ZQEUX1/RG', 'chef', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity`
--

CREATE TABLE `user_activity` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_activity`
--

INSERT INTO `user_activity` (`id`, `user_id`, `action_type`, `description`, `ip_address`, `timestamp`) VALUES
(1, 11, 'signup', 'New user registration', '::1', '2025-05-13 01:39:18'),
(2, 5, 'logout', 'User logged out', '::1', '2025-05-13 01:40:32'),
(3, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(4, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(5, 5, 'login', 'User logged in', NULL, '2025-05-13 01:46:48'),
(6, 5, 'login', 'User logged in', NULL, '2025-05-13 01:47:08'),
(7, 11, 'signup', 'New user registration', '::1', '2025-05-13 01:39:18'),
(8, 5, 'logout', 'User logged out', '::1', '2025-05-13 01:40:32'),
(9, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(10, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(11, 11, 'signup', 'New user registration', '::1', '2025-05-13 01:39:18'),
(12, 5, 'logout', 'User logged out', '::1', '2025-05-13 01:40:32'),
(13, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(14, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(15, 5, 'login', 'User logged in', NULL, '2025-05-13 01:46:48'),
(16, 5, 'login', 'User logged in', NULL, '2025-05-13 01:47:08'),
(17, 11, 'signup', 'New user registration', '::1', '2025-05-13 01:39:18'),
(18, 5, 'logout', 'User logged out', '::1', '2025-05-13 01:40:32'),
(19, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(20, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(21, 11, 'signup', 'New user registration', '::1', '2025-05-13 01:39:18'),
(22, 5, 'logout', 'User logged out', '::1', '2025-05-13 01:40:32'),
(23, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(24, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(25, 5, 'login', 'User logged in', NULL, '2025-05-13 01:46:48'),
(26, 5, 'login', 'User logged in', NULL, '2025-05-13 01:47:08'),
(27, 11, 'signup', 'New user registration', '::1', '2025-05-13 01:39:18'),
(28, 5, 'logout', 'User logged out', '::1', '2025-05-13 01:40:32'),
(29, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(30, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(31, 11, 'signup', 'New user registration', '::1', '2025-05-13 01:39:18'),
(32, 5, 'logout', 'User logged out', '::1', '2025-05-13 01:40:32'),
(33, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(34, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(35, 5, 'login', 'User logged in', NULL, '2025-05-13 01:46:48'),
(36, 5, 'login', 'User logged in', NULL, '2025-05-13 01:47:08'),
(37, 11, 'signup', 'New user registration', '::1', '2025-05-13 01:39:18'),
(38, 5, 'logout', 'User logged out', '::1', '2025-05-13 01:40:32'),
(39, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(40, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(41, 5, 'logout', 'User logged out', NULL, '2025-05-13 01:55:00'),
(42, 5, 'login', 'User logged in', NULL, '2025-05-13 01:55:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`);

--
-- Indexes for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_activity`
--
ALTER TABLE `user_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD CONSTRAINT `user_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
