-- ============================================================
--  EMEIA DATABASE SETUP (v4)
--  Run: mysql -u root -p < emeia_db.sql
--  Or paste into phpMyAdmin → SQL tab
-- ============================================================

CREATE DATABASE IF NOT EXISTS emeia_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE emeia_db;

-- ------------------------------------------------------------
--  PARENTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS parents (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(100)  NOT NULL UNIQUE,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  passwordHash VARCHAR(255)  NOT NULL,
  phoneNumber  VARCHAR(20)   DEFAULT NULL,
  pin          VARCHAR(10)   NOT NULL,
  avatarColor  VARCHAR(20)   DEFAULT '#FF8C00',
  createdAt    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
--  CHILDREN
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS children (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  parentId    INT           NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  pin         VARCHAR(10)   NOT NULL DEFAULT '1234',
  coins       INT           DEFAULT 0,
  avatarColor VARCHAR(20)   DEFAULT '#4CAF50',
  createdAt   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parentId) REFERENCES parents(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
--  QUESTS
--  Status flow:
--    PENDING    → child is working on it
--    SUBMITTED  → child marked done, waiting for parent review
--    VERIFIED   → parent approved, coins awarded
--    CANCELLED  → another child completed a global quest first
--
--  globalGroupId:
--    NULL  = normal quest for one child
--    >0    = global quest; all rows with the same globalGroupId
--             are copies of the same task across siblings.
--             When one is VERIFIED, the others become CANCELLED.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quests (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  childId       INT           NOT NULL,
  title         VARCHAR(200)  NOT NULL,
  description   TEXT          DEFAULT NULL,
  reward        INT           DEFAULT 0,
  status        ENUM('PENDING','SUBMITTED','VERIFIED','CANCELLED') DEFAULT 'PENDING',
  globalGroupId INT           NULL DEFAULT NULL,
  createdAt     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (childId) REFERENCES children(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
--  COIN HISTORY
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coin_history (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  childId   INT           NOT NULL,
  type      ENUM('EARNED','SPENT') NOT NULL,
  amount    INT           NOT NULL,
  reason    VARCHAR(200)  DEFAULT NULL,
  createdAt TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (childId) REFERENCES children(id) ON DELETE CASCADE
);

-- ============================================================
--  SAMPLE DATA
--  Parent login:   parent@emeia.com  /  password123
--  Parent PIN:     1234
--  All child PINs: 1234
-- ============================================================

INSERT INTO parents (username, email, passwordHash, phoneNumber, pin, avatarColor)
VALUES (
  'Parent',
  'parent@emeia.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  '+1234567890',
  '1234',
  '#FF8C00'
);

INSERT INTO children (parentId, name, pin, coins, avatarColor) VALUES
(1, 'Aman Ali',    '1234', 150, '#FF8C00'),
(1, 'Abderrahman', '1234', 320, '#4CAF50'),
(1, 'Hamdi',       '1234',  80, '#2196F3'),
(1, 'Ahmad',       '1234', 500, '#9C27B0');

-- Normal single-child quests
INSERT INTO quests (childId, title, description, reward, status) VALUES
(1, 'Do Homework',     'Finish all homework for today.',            30, 'SUBMITTED'),
(1, 'Wash Dishes',     'Wash and dry all the dishes.',              20, 'VERIFIED'),
(2, 'Take Out Trash',  'Take all bins outside.',                    25, 'PENDING'),
(2, 'Read 30 Minutes', 'Read any book for 30 minutes.',             40, 'SUBMITTED'),
(3, 'Feed the Cat',    'Feed the cat morning and evening.',         15, 'PENDING'),
(4, 'Mop the Floor',   'Mop the kitchen and hallway.',              60, 'VERIFIED'),
(4, 'Set the Table',   'Set the table before dinner.',              10, 'PENDING');

-- Global quest: "Clean Room" assigned to all 4 children (globalGroupId = 100)
INSERT INTO quests (childId, title, description, reward, status, globalGroupId) VALUES
(1, 'Clean Room', 'First one to tidy their bedroom wins the coins!', 50, 'PENDING', 100),
(2, 'Clean Room', 'First one to tidy their bedroom wins the coins!', 50, 'PENDING', 100),
(3, 'Clean Room', 'First one to tidy their bedroom wins the coins!', 50, 'PENDING', 100),
(4, 'Clean Room', 'First one to tidy their bedroom wins the coins!', 50, 'PENDING', 100);

-- Coin history for the two VERIFIED quests
INSERT INTO coin_history (childId, type, amount, reason) VALUES
(1, 'EARNED', 20, 'Quest completed'),
(4, 'EARNED', 60, 'Quest completed');
