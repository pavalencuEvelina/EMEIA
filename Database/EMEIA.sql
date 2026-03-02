-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2026 at 07:22 PM
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
-- Database: `biblioteca_online`
--
CREATE DATABASE IF NOT EXISTS `biblioteca_online` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `biblioteca_online`;

-- --------------------------------------------------------

--
-- Table structure for table `carti_biblioteca`
--

CREATE TABLE `carti_biblioteca` (
  `id` int(11) NOT NULL,
  `titlu_carte` varchar(255) DEFAULT NULL,
  `autor` varchar(255) DEFAULT NULL,
  `gen_literar` varchar(100) DEFAULT NULL,
  `an_publicare` int(11) DEFAULT NULL,
  `nr_pagini` int(11) DEFAULT NULL,
  `descriere` text DEFAULT NULL,
  `stare_disponibilitate` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carti_biblioteca`
--

INSERT INTO `carti_biblioteca` (`id`, `titlu_carte`, `autor`, `gen_literar`, `an_publicare`, `nr_pagini`, `descriere`, `stare_disponibilitate`) VALUES
(1, 'Mândrie și Prejudecată', 'Jane Austen', 'Ficțiune', 1813, 432, 'Roman clasic despre dragoste și societate.', 1),
(2, '1984', 'George Orwell', 'Ficțiune', 1949, 328, 'Roman distopic despre un regim totalitar.', 1),
(3, 'Atomic Habits', 'James Clear', 'Dezvoltare personală', 2018, 320, 'Carte despre formarea obiceiurilor eficiente.', 1),
(4, 'Clean Code', 'Robert C. Martin', 'Tehnic', 2008, 464, 'Ghid pentru scrierea codului curat.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `utilizatori`
--

CREATE TABLE `utilizatori` (
  `id` int(11) NOT NULL,
  `nume` varchar(100) DEFAULT NULL,
  `prenume` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `nr_telefon` varchar(20) DEFAULT NULL,
  `data_inregistrare` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilizatori`
--

INSERT INTO `utilizatori` (`id`, `nume`, `prenume`, `email`, `nr_telefon`, `data_inregistrare`) VALUES
(1, 'Popa', 'Andrei', 'andrei.popa@gmail.com', '069123456', '2026-02-18'),
(2, 'Rusu', 'Maria', 'maria.rusu@university.edu', '068987654', '2026-02-18'),
(4, 'Georgescu', 'David', 'david@college.edu', '067456789', '2026-01-09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carti_biblioteca`
--
ALTER TABLE `carti_biblioteca`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `utilizatori`
--
ALTER TABLE `utilizatori`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carti_biblioteca`
--
ALTER TABLE `carti_biblioteca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `utilizatori`
--
ALTER TABLE `utilizatori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- Database: `evidenta_cadastrala`
--
CREATE DATABASE IF NOT EXISTS `evidenta_cadastrala` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `evidenta_cadastrala`;

-- --------------------------------------------------------

--
-- Table structure for table `inregistrarecadastrala`
--

CREATE TABLE `inregistrarecadastrala` (
  `IdInregistrare` int(11) NOT NULL,
  `IdProprietar` int(11) NOT NULL,
  `IdTeren` int(11) NOT NULL,
  `DataInregistrare` date NOT NULL,
  `NrExtras` int(11) NOT NULL,
  `Status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inregistrarecadastrala`
--

INSERT INTO `inregistrarecadastrala` (`IdInregistrare`, `IdProprietar`, `IdTeren`, `DataInregistrare`, `NrExtras`, `Status`) VALUES
(2, 3, 4, '2026-02-22', 19, 'in proces');

-- --------------------------------------------------------

--
-- Table structure for table `proprietar`
--

CREATE TABLE `proprietar` (
  `IdProprietar` int(11) NOT NULL,
  `Nume` varchar(50) NOT NULL,
  `Prenume` varchar(50) NOT NULL,
  `CodPersonal` varchar(13) NOT NULL,
  `Telefon` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `proprietar`
--

INSERT INTO `proprietar` (`IdProprietar`, `Nume`, `Prenume`, `CodPersonal`, `Telefon`) VALUES
(3, 'dsfcfs', 'sf', '2004500965163', '068552356');

-- --------------------------------------------------------

--
-- Table structure for table `teren`
--

CREATE TABLE `teren` (
  `IdTeren` int(11) NOT NULL,
  `CategorieFolosinta` varchar(200) NOT NULL,
  `Suprafata` float NOT NULL,
  `Adresa` varchar(100) NOT NULL,
  `Zona` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teren`
--

INSERT INTO `teren` (`IdTeren`, `CategorieFolosinta`, `Suprafata`, `Adresa`, `Zona`) VALUES
(2, 'Afacere', 23, 'Dacia 12', 'Chisinau'),
(3, 'Afacere', 120, 'Mihai Viteazu 2', 'Chisinau'),
(4, 'Locuinta', 60, 'Scrisul latin', 'Orhei');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inregistrarecadastrala`
--
ALTER TABLE `inregistrarecadastrala`
  ADD PRIMARY KEY (`IdInregistrare`),
  ADD KEY `IdTeren` (`IdTeren`),
  ADD KEY `IdProprietar` (`IdProprietar`);

--
-- Indexes for table `proprietar`
--
ALTER TABLE `proprietar`
  ADD PRIMARY KEY (`IdProprietar`);

--
-- Indexes for table `teren`
--
ALTER TABLE `teren`
  ADD PRIMARY KEY (`IdTeren`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inregistrarecadastrala`
--
ALTER TABLE `inregistrarecadastrala`
  MODIFY `IdInregistrare` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `proprietar`
--
ALTER TABLE `proprietar`
  MODIFY `IdProprietar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `teren`
--
ALTER TABLE `teren`
  MODIFY `IdTeren` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inregistrarecadastrala`
--
ALTER TABLE `inregistrarecadastrala`
  ADD CONSTRAINT `inregistrarecadastrala_ibfk_1` FOREIGN KEY (`IdTeren`) REFERENCES `teren` (`IdTeren`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inregistrarecadastrala_ibfk_2` FOREIGN KEY (`IdProprietar`) REFERENCES `proprietar` (`IdProprietar`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Database: `parentchildappdb`
--
CREATE DATABASE IF NOT EXISTS `parentchildappdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `parentchildappdb`;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `Id` char(36) NOT NULL DEFAULT uuid(),
  `UserId` char(36) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`Id`, `UserId`, `PasswordHash`, `CreatedAt`) VALUES
('ea81833e-1276-11f1-b7fc-0d0904f8d337', 'ea7f1572-1276-11f1-b7fc-0d0904f8d337', 'HASH_ADMIN_100', '2026-02-25 20:22:17');

-- --------------------------------------------------------

--
-- Table structure for table `children`
--

CREATE TABLE `children` (
  `Id` char(36) NOT NULL DEFAULT uuid(),
  `AdminId` char(36) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Coins` int(11) NOT NULL DEFAULT 0,
  `AvatarColor` varchar(50) DEFAULT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `children`
--

INSERT INTO `children` (`Id`, `AdminId`, `Name`, `Coins`, `AvatarColor`, `PasswordHash`, `CreatedAt`) VALUES
('ea8a9d17-1276-11f1-b7fc-0d0904f8d337', 'ea81833e-1276-11f1-b7fc-0d0904f8d337', 'Oliver', 15, 'Cyan', 'HASH_OLIVER', '2026-02-25 20:22:17'),
('ea8cbe39-1276-11f1-b7fc-0d0904f8d337', 'ea81833e-1276-11f1-b7fc-0d0904f8d337', 'Luna', 3, 'Magenta', 'HASH_LUNA', '2026-02-25 20:22:17');

-- --------------------------------------------------------

--
-- Table structure for table `quests`
--

CREATE TABLE `quests` (
  `Id` char(36) NOT NULL DEFAULT uuid(),
  `ChildId` char(36) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `Description` text DEFAULT NULL,
  `Reward` int(11) NOT NULL,
  `Status` enum('PENDING','COMPLETED','VERIFIED') NOT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `CompletedAt` datetime DEFAULT NULL,
  `VerifiedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quests`
--

INSERT INTO `quests` (`Id`, `ChildId`, `Title`, `Description`, `Reward`, `Status`, `CreatedAt`, `CompletedAt`, `VerifiedAt`) VALUES
('ea9116e3-1276-11f1-b7fc-0d0904f8d337', 'ea8a9d17-1276-11f1-b7fc-0d0904f8d337', 'Clean Garage', 'Organize tools and sweep floor', 40, 'PENDING', '2026-02-25 20:22:17', NULL, NULL),
('ea9125d6-1276-11f1-b7fc-0d0904f8d337', 'ea8a9d17-1276-11f1-b7fc-0d0904f8d337', 'English Homework', 'Complete reading assignment', 20, 'COMPLETED', '2026-02-25 20:22:17', NULL, NULL),
('ea9126c7-1276-11f1-b7fc-0d0904f8d337', 'ea8cbe39-1276-11f1-b7fc-0d0904f8d337', 'Set the Table', 'Prepare table for dinner', 10, 'VERIFIED', '2026-02-25 20:22:17', NULL, NULL),
('ea912726-1276-11f1-b7fc-0d0904f8d337', 'ea8cbe39-1276-11f1-b7fc-0d0904f8d337', 'Practice Piano', 'Practice for 30 minutes', 25, 'PENDING', '2026-02-25 20:22:17', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` char(36) NOT NULL DEFAULT uuid(),
  `Username` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Username`, `Email`, `PasswordHash`, `PhoneNumber`, `CreatedAt`) VALUES
('ea7f1572-1276-11f1-b7fc-0d0904f8d337', 'super_parent', 'super.parent@mail.com', 'HASH_USER_100', '067777888', '2026-02-25 20:22:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UserId` (`UserId`);

--
-- Indexes for table `children`
--
ALTER TABLE `children`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Children_AdminId` (`AdminId`);

--
-- Indexes for table `quests`
--
ALTER TABLE `quests`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Quests_Child_Status` (`ChildId`,`Status`),
  ADD KEY `IX_Quests_Status` (`Status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `IX_Users_Email` (`Email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `FK_Admin_User` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `children`
--
ALTER TABLE `children`
  ADD CONSTRAINT `FK_Child_Admin` FOREIGN KEY (`AdminId`) REFERENCES `admins` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `quests`
--
ALTER TABLE `quests`
  ADD CONSTRAINT `FK_Quest_Child` FOREIGN KEY (`ChildId`) REFERENCES `children` (`Id`) ON DELETE CASCADE;
--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--
-- Error reading structure for table phpmyadmin.pma__bookmark: #1932 - Table &#039;phpmyadmin.pma__bookmark&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__bookmark: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__bookmark`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--
-- Error reading structure for table phpmyadmin.pma__central_columns: #1932 - Table &#039;phpmyadmin.pma__central_columns&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__central_columns: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__central_columns`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--
-- Error reading structure for table phpmyadmin.pma__column_info: #1932 - Table &#039;phpmyadmin.pma__column_info&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__column_info: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__column_info`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--
-- Error reading structure for table phpmyadmin.pma__designer_settings: #1932 - Table &#039;phpmyadmin.pma__designer_settings&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__designer_settings: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__designer_settings`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--
-- Error reading structure for table phpmyadmin.pma__export_templates: #1932 - Table &#039;phpmyadmin.pma__export_templates&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__export_templates: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__export_templates`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--
-- Error reading structure for table phpmyadmin.pma__favorite: #1932 - Table &#039;phpmyadmin.pma__favorite&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__favorite: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__favorite`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__history`
--
-- Error reading structure for table phpmyadmin.pma__history: #1932 - Table &#039;phpmyadmin.pma__history&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__history: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__history`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--
-- Error reading structure for table phpmyadmin.pma__navigationhiding: #1932 - Table &#039;phpmyadmin.pma__navigationhiding&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__navigationhiding: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__navigationhiding`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--
-- Error reading structure for table phpmyadmin.pma__pdf_pages: #1932 - Table &#039;phpmyadmin.pma__pdf_pages&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__pdf_pages: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__pdf_pages`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--
-- Error reading structure for table phpmyadmin.pma__recent: #1932 - Table &#039;phpmyadmin.pma__recent&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__recent: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__recent`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--
-- Error reading structure for table phpmyadmin.pma__relation: #1932 - Table &#039;phpmyadmin.pma__relation&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__relation: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__relation`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--
-- Error reading structure for table phpmyadmin.pma__savedsearches: #1932 - Table &#039;phpmyadmin.pma__savedsearches&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__savedsearches: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__savedsearches`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--
-- Error reading structure for table phpmyadmin.pma__table_coords: #1932 - Table &#039;phpmyadmin.pma__table_coords&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__table_coords: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__table_coords`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_info`
--
-- Error reading structure for table phpmyadmin.pma__table_info: #1932 - Table &#039;phpmyadmin.pma__table_info&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__table_info: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__table_info`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--
-- Error reading structure for table phpmyadmin.pma__table_uiprefs: #1932 - Table &#039;phpmyadmin.pma__table_uiprefs&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__table_uiprefs: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__table_uiprefs`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--
-- Error reading structure for table phpmyadmin.pma__tracking: #1932 - Table &#039;phpmyadmin.pma__tracking&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__tracking: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__tracking`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--
-- Error reading structure for table phpmyadmin.pma__userconfig: #1932 - Table &#039;phpmyadmin.pma__userconfig&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__userconfig: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__userconfig`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--
-- Error reading structure for table phpmyadmin.pma__usergroups: #1932 - Table &#039;phpmyadmin.pma__usergroups&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__usergroups: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__usergroups`&#039; at line 1

-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--
-- Error reading structure for table phpmyadmin.pma__users: #1932 - Table &#039;phpmyadmin.pma__users&#039; doesn&#039;t exist in engine
-- Error reading data for table phpmyadmin.pma__users: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near &#039;FROM `phpmyadmin`.`pma__users`&#039; at line 1
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
