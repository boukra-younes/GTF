-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2025 at 05:03 AM
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
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `agent_id` int(11) NOT NULL,
  `status` enum('free','busy') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`agent_id`, `status`) VALUES
(14, 'busy'),
(15, 'free'),
(26, 'busy');

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
(22, 6, 'New user registration: mohamed (moha@mail.com)', 0, '2025-05-28 12:59:06'),
(23, 6, 'New user registration: amine (amine@mail.com)', 0, '2025-06-01 00:36:57'),
(25, 6, 'New user registration: nes (nes@mail.com)', 0, '2025-06-01 00:40:43'),
(32, 6, 'New user registration: nes (ne@mail.com)', 0, '2025-06-01 00:54:21');

-- --------------------------------------------------------

--
-- Table structure for table `travail`
--

CREATE TABLE `travail` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `responsable_id` int(11) DEFAULT NULL,
  `agents_affectes_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `travail`
--

INSERT INTO `travail` (`id`, `titre`, `description`, `location`, `date_debut`, `date_fin`, `responsable_id`, `agents_affectes_id`, `status`, `created_at`) VALUES
(16, 'plantation', 'lutte contre la deforestation', NULL, '2025-05-13', '2026-05-12', 12, 14, 'in_progress', '2025-05-31'),
(20, 'plantation', 'lutte contre la deforestation', NULL, '2025-05-13', '2026-05-12', 12, 26, 'in_progress', '2025-05-31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fname` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('agent','admin','responsable') NOT NULL,
  `status` enum('pending','active') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `email`, `password`, `role`, `status`) VALUES
(6, 'fatima benchenina', 'tima@mail.com', '$2y$10$jWRLtuci6FwOVKGm2Su1we.Tkmx0XFd.6GSl8Uyds50VYTINj8y3W', 'admin', 'active'),
(12, 'fatima', 'fatima2@mail.com', '$2y$10$A7ngQ0GVqb/wU6NVSNLG4uFNjJyXhVyMHAj7MO6rKvYGrIjr9wVU.', 'responsable', 'active'),
(13, 'mansouria hamdi ', 'mansouriahamdi@mail.com', '$2y$10$HWWYjuAppw4XunQDCUBwc.NfkS5Fw.FqUOp/3T4L/W1TkxYg2e5Ey', 'responsable', 'active'),
(14, 'rian hamdi', 'rian@gmail.com', '$2y$10$Kvj2Z59Qm10ysq9Ipy.3Oe9WohigvMIqgjniw8q.IL7tmcM.0ySdG', 'agent', 'active'),
(15, 'sara ber', 'sara@mail.com', '$2y$10$JU./gz2QUdxEN.CEeYWNtuEnHYPh5XfCNynnZtqpjXglXa7TcjzBq', 'agent', 'active'),
(16, 'mohamed', 'moha@mail.com', '$2y$10$gNRRzJuUgr3o0mdI9PfzeesXpqGAWVhH25vE9Dt/nsqmeLr2GUsWu', 'agent', 'active'),
(18, 'amine', 'amine@mail.com', '$2y$10$YhrJ4nbukdurx4c30hgVJ.1CuhcfAb2Mg8xo/FPVOMwzlzZrFh1MK', 'agent', 'pending'),
(19, 'nes', 'nes@mail.com', '$2y$10$yCFXyXRASV8UPEL8icaZ6.461q5ZScZnWFkNtqjFKMEjBOGPuoQy2', 'agent', 'pending'),
(26, 'nes', 'ne@mail.com', '$2y$10$YLlaNPFQUngz6r..lmsPWuW51YyE4whJ.Pfbe0SzPefybpcHZZ1V2', 'agent', 'active');

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
(3, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(4, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(9, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(10, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(13, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(14, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(19, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(20, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(23, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(24, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(29, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(30, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(33, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(34, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(39, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(40, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(50, 6, 'login', 'User logged in', NULL, '2025-05-13 22:30:23'),
(51, 6, 'deactivate_user', 'Admin deactivated user ID: 7', NULL, '2025-05-13 23:15:22'),
(52, 6, 'delete_user', 'Admin deleted user: test (test5888@mail.com)', NULL, '2025-05-13 23:15:31'),
(53, 6, 'login', 'User logged in', NULL, '2025-05-14 15:24:45'),
(54, 6, 'deactivate_user', 'Admin deactivated user ID: 10', NULL, '2025-05-14 15:26:24'),
(57, 6, 'logout', 'User logged out', NULL, '2025-05-14 15:30:19'),
(58, 12, 'signup', 'New user registration', NULL, '2025-05-14 15:31:38'),
(59, 6, 'login', 'User logged in', NULL, '2025-05-14 15:32:33'),
(60, 6, 'login', 'User logged in', NULL, '2025-05-16 19:12:18'),
(61, 6, 'logout', 'User logged out', NULL, '2025-05-16 19:13:31'),
(62, 6, 'login', 'User logged in', NULL, '2025-05-17 01:29:27'),
(64, 6, 'login', 'User logged in', NULL, '2025-05-23 16:47:05'),
(65, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(66, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(67, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(68, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(69, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(70, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(71, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(72, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(73, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(74, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(75, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(76, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(77, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(78, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(79, 6, 'login', 'User logged in', '::1', '2025-05-13 01:41:15'),
(80, 6, 'modify_user', 'Admin modified user ID: 9, Name: tima benchenina, Email: tima2@mail.com', '::1', '2025-05-13 01:42:12'),
(81, 6, 'login', 'User logged in', NULL, '2025-05-13 22:30:23'),
(82, 6, 'deactivate_user', 'Admin deactivated user ID: 7', NULL, '2025-05-13 23:15:22'),
(83, 6, 'delete_user', 'Admin deleted user: test (test5888@mail.com)', NULL, '2025-05-13 23:15:31'),
(84, 6, 'login', 'User logged in', NULL, '2025-05-14 15:24:45'),
(85, 6, 'deactivate_user', 'Admin deactivated user ID: 10', NULL, '2025-05-14 15:26:24'),
(86, 6, 'logout', 'User logged out', NULL, '2025-05-14 15:30:19'),
(87, 12, 'signup', 'New user registration', NULL, '2025-05-14 15:31:38'),
(88, 6, 'login', 'User logged in', NULL, '2025-05-14 15:32:33'),
(89, 6, 'login', 'User logged in', NULL, '2025-05-16 19:12:18'),
(90, 6, 'approve_user', 'Admin approved user ID: 12', NULL, '2025-05-23 16:59:42'),
(91, 6, 'login', 'User logged in', NULL, '2025-05-25 12:48:44'),
(92, 6, 'deactivate_user', 'Admin deactivated user ID: 12', NULL, '2025-05-25 12:48:53'),
(93, 13, 'signup', 'New user registration', NULL, '2025-05-28 10:58:28'),
(94, 6, 'login', 'User logged in', NULL, '2025-05-28 10:59:04'),
(95, 6, 'approve_user', 'Admin approved user ID: 12', NULL, '2025-05-28 11:01:01'),
(96, 6, 'modify_user', 'Admin modified user ID: 12, Name: fatima, Email: fatima2@mail.com', NULL, '2025-05-28 11:01:15'),
(97, 6, 'logout', 'User logged out', NULL, '2025-05-28 11:07:11'),
(98, 14, 'signup', 'New user registration', NULL, '2025-05-28 11:11:33'),
(99, 6, 'login', 'User logged in', NULL, '2025-05-28 11:12:45'),
(100, 6, 'approve_user', 'Admin approved user ID: 13', NULL, '2025-05-28 11:13:47'),
(101, 6, 'logout', 'User logged out', NULL, '2025-05-28 11:15:35'),
(102, 6, 'login', 'User logged in', NULL, '2025-05-28 11:15:57'),
(103, 15, 'signup', 'New user registration', NULL, '2025-05-28 11:54:41'),
(104, 6, 'login', 'User logged in', NULL, '2025-05-28 11:55:51'),
(105, 6, 'approve_user', 'Admin approved user ID: 14', NULL, '2025-05-28 11:57:26'),
(106, 6, 'logout', 'User logged out', NULL, '2025-05-28 12:01:59'),
(107, 16, 'signup', 'New user registration', NULL, '2025-05-28 12:59:06'),
(108, 6, 'login', 'User logged in', NULL, '2025-05-28 13:00:42'),
(109, 6, 'approve_user', 'Admin approved user ID: 16', NULL, '2025-05-28 13:01:24'),
(110, 6, 'login', 'User logged in', NULL, '2025-05-29 23:47:37'),
(111, 6, 'logout', 'User logged out', NULL, '2025-05-29 23:48:25'),
(112, 12, 'login', 'User logged in', NULL, '2025-05-30 00:13:43'),
(113, 12, 'login', 'User logged in', NULL, '2025-05-30 00:15:51'),
(114, 12, 'login', 'User logged in', NULL, '2025-05-30 00:16:46'),
(115, 6, 'login', 'User logged in', NULL, '2025-05-30 00:38:00'),
(116, 6, 'logout', 'User logged out', NULL, '2025-05-30 00:39:13'),
(117, 12, 'login', 'User logged in', NULL, '2025-05-30 18:01:20'),
(118, 12, 'login', 'User logged in', NULL, '2025-05-30 18:01:39'),
(119, 12, 'logout', 'User logged out', NULL, '2025-05-31 00:09:53'),
(120, 12, 'login', 'User logged in', NULL, '2025-05-31 00:11:30'),
(121, 12, 'logout', 'User logged out', NULL, '2025-05-31 00:33:59'),
(122, 6, 'login', 'User logged in', NULL, '2025-05-31 00:34:10'),
(123, 6, 'logout', 'User logged out', NULL, '2025-05-31 00:34:25'),
(124, 12, 'login', 'User logged in', NULL, '2025-05-31 00:37:15'),
(125, 12, 'logout', 'User logged out', NULL, '2025-05-31 01:01:26'),
(126, 12, 'login', 'User logged in', NULL, '2025-05-31 01:04:48'),
(127, 12, 'logout', 'User logged out', NULL, '2025-05-31 01:05:57'),
(128, 12, 'login', 'User logged in', NULL, '2025-05-31 01:06:04'),
(129, 12, 'login', 'User logged in', NULL, '2025-05-31 02:03:15'),
(130, 12, 'travail_created', 'Created new travail: qsdqsdqsdqsdqs', NULL, '2025-05-31 02:42:32'),
(131, 12, 'login', 'User logged in', NULL, '2025-05-31 02:44:01'),
(132, 12, 'login', 'User logged in', NULL, '2025-05-31 11:00:34'),
(133, 12, 'login', 'User logged in', NULL, '2025-05-31 12:49:31'),
(134, 12, 'login', 'User logged in', NULL, '2025-05-31 13:05:47'),
(135, 12, 'login', 'User logged in', NULL, '2025-05-31 17:48:43'),
(136, 12, 'travail_deleted', 'Deleted travail ID: 1', NULL, '2025-05-31 20:04:53'),
(137, 12, 'travail_deleted', 'Deleted travail ID: 1', NULL, '2025-05-31 20:05:59'),
(138, 12, 'travail_deleted', 'Deleted travail ID: 2', NULL, '2025-05-31 20:06:06'),
(139, 12, 'travail_deleted', 'Deleted travail ID: 2', NULL, '2025-05-31 20:06:09'),
(140, 12, 'travail_deleted', 'Deleted travail ID: 2', NULL, '2025-05-31 20:06:44'),
(141, 12, 'travail_deleted', 'Deleted travail ID: 3', NULL, '2025-05-31 20:08:17'),
(142, 12, 'travail_deleted', 'Deleted travail ID: 3', NULL, '2025-05-31 20:13:12'),
(143, 12, 'travail_deleted', 'Deleted travail ID: 4', NULL, '2025-05-31 20:14:29'),
(144, 12, 'travail_deleted', 'Deleted travail ID: 5', NULL, '2025-05-31 20:14:34'),
(145, 12, 'travail_deleted', 'Deleted travail ID: 6', NULL, '2025-05-31 20:16:31'),
(146, 12, 'delete_user', 'Deleted Project: 7', NULL, '2025-05-31 20:28:41'),
(147, 12, 'delete_user', 'Deleted Project: 15', NULL, '2025-05-31 20:29:11'),
(148, 12, 'delete_user', 'Deleted Project: 8', NULL, '2025-05-31 20:29:12'),
(149, 12, 'delete_user', 'Deleted Project: 9', NULL, '2025-05-31 20:29:13'),
(150, 12, 'delete_user', 'Deleted Project: 10', NULL, '2025-05-31 20:29:14'),
(151, 12, 'delete_user', 'Deleted Project: 11', NULL, '2025-05-31 20:29:15'),
(152, 12, 'delete_user', 'Deleted Project: 12', NULL, '2025-05-31 20:29:15'),
(153, 12, 'delete_user', 'Deleted Project: 13', NULL, '2025-05-31 20:29:16'),
(154, 12, 'delete_user', 'Deleted Project: 14', NULL, '2025-05-31 20:29:16'),
(155, 12, 'logout', 'User logged out', NULL, '2025-05-31 20:32:41'),
(156, 6, 'login', 'User logged in', NULL, '2025-05-31 20:32:48'),
(157, 6, 'deactivate_user', 'Admin deactivated user ID: 14', NULL, '2025-05-31 20:32:58'),
(158, 12, 'login', 'User logged in', NULL, '2025-05-31 20:36:20'),
(159, 12, 'delete_user', 'Deleted Project: 17', NULL, '2025-05-31 20:40:02'),
(160, 12, 'delete_user', 'Deleted Project: 18', NULL, '2025-05-31 20:41:39'),
(161, 12, 'login', 'User logged in', NULL, '2025-05-31 20:47:45'),
(162, 12, 'logout', 'User logged out', NULL, '2025-05-31 20:53:04'),
(163, 12, 'login', 'User logged in', NULL, '2025-05-31 20:53:14'),
(164, 12, 'logout', 'User logged out', NULL, '2025-05-31 23:16:20'),
(165, 6, 'login', 'User logged in', NULL, '2025-05-31 23:16:27'),
(166, 6, 'logout', 'User logged out', NULL, '2025-05-31 23:28:16'),
(167, 12, 'login', 'User logged in', NULL, '2025-05-31 23:28:29'),
(168, 12, 'delete_user', 'Deleted Project: 19', NULL, '2025-05-31 23:28:38'),
(170, 18, 'signup', 'New user registration', NULL, '2025-06-01 00:38:18'),
(171, 19, 'signup', 'New user registration', NULL, '2025-06-01 00:40:43'),
(178, 26, 'signup', 'New user registration', NULL, '2025-06-01 00:54:21'),
(179, 12, 'assign_agent', 'Assigned agent rian hamdi (rian@gmail.com) to travail \'plantation\' (ID: 16)', NULL, '2025-06-01 02:09:56'),
(180, 12, 'assign_agent', 'Assigned agent rian hamdi (rian@gmail.com) to travail \'plantation\' (ID: 16)', NULL, '2025-06-01 02:10:35'),
(181, 12, 'logout', 'User logged out', NULL, '2025-06-01 02:32:45'),
(182, 6, 'login', 'User logged in', NULL, '2025-06-01 02:32:59'),
(183, 6, 'logout', 'User logged out', NULL, '2025-06-01 02:33:35'),
(184, 12, 'login', 'User logged in', NULL, '2025-06-01 02:33:42'),
(185, 12, 'assign_agent', 'Assigned agent sara ber (sara@mail.com) to travail \'plantation\' (ID: 16)', NULL, '2025-06-01 02:39:34'),
(186, 12, 'assign_agent', 'Assigned agent rian hamdi (rian@gmail.com) to travail \'plantation\' (ID: 16)', NULL, '2025-06-01 02:54:54'),
(187, 12, 'assign_agent', 'Assigned agent nes (ne@mail.com) to travail \'plantation\' (ID: 20)', NULL, '2025-06-01 02:55:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`agent_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `travail`
--
ALTER TABLE `travail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `responsable_id` (`responsable_id`),
  ADD KEY `agents_affectes_id` (`agents_affectes_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `travail`
--
ALTER TABLE `travail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `user_activity`
--
ALTER TABLE `user_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agents`
--
ALTER TABLE `agents`
  ADD CONSTRAINT `agents_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `travail`
--
ALTER TABLE `travail`
  ADD CONSTRAINT `travail_ibfk_1` FOREIGN KEY (`responsable_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `travail_ibfk_2` FOREIGN KEY (`agents_affectes_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD CONSTRAINT `user_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
