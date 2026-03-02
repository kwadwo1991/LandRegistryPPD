-- Techiman North Land Registration System
-- Database Schema for CPanel/MySQL

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('Admin','Head','DateEntryOfficer','Secretary','Staff') NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `land_parcels`
--

CREATE TABLE `land_parcels` (
  `id` varchar(50) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `size` varchar(100) NOT NULL,
  `type` enum('Land','Development','Building') NOT NULL,
  `status` enum('Pending','Approved','Queried','Rejected') NOT NULL DEFAULT 'Pending',
  `registration_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `coordinates` varchar(255) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `land_parcels_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `registration_history`
--

CREATE TABLE `registration_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parcel_id` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `comment` text DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `parcel_id` (`parcel_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `registration_history_ibfk_1` FOREIGN KEY (`parcel_id`) REFERENCES `land_parcels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `registration_history_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
