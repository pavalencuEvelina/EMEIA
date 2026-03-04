/* =========================================
   CREATE DATABASE
========================================= */

DROP DATABASE IF EXISTS ParentChildAppDB;
CREATE DATABASE ParentChildAppDB;
USE ParentChildAppDB;


/* =========================================
   TABLES
========================================= */

CREATE TABLE Users (
    Id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IX_Users_Email ON Users(Email);



CREATE TABLE Admins (
    Id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    UserId CHAR(36) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Admin_User
        FOREIGN KEY (UserId) REFERENCES Users(Id)
        ON DELETE CASCADE
);



CREATE TABLE Children (
    Id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    AdminId CHAR(36) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Coins INT NOT NULL DEFAULT 0,
    AvatarColor VARCHAR(50),
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Child_Admin
        FOREIGN KEY (AdminId) REFERENCES Admins(Id)
        ON DELETE CASCADE
);

CREATE INDEX IX_Children_AdminId ON Children(AdminId);



CREATE TABLE Quests (
    Id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ChildId CHAR(36) NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    Reward INT NOT NULL,
    Status ENUM('PENDING','COMPLETED','VERIFIED') NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CompletedAt DATETIME NULL,
    VerifiedAt DATETIME NULL,

    CONSTRAINT FK_Quest_Child
        FOREIGN KEY (ChildId) REFERENCES Children(Id)
        ON DELETE CASCADE
);

CREATE INDEX IX_Quests_Child_Status 
ON Quests(ChildId, Status);

CREATE INDEX IX_Quests_Status 
ON Quests(Status);



/* =========================================
   SEED DATA
========================================= */

SET @UserId = UUID();
SET @AdminId = UUID();

INSERT INTO Users (Id, Username, Email, PasswordHash, PhoneNumber)
VALUES 
(@UserId, 'super_parent', 'super.parent@mail.com', 'HASH_USER_100', '067777888');

INSERT INTO Admins (Id, UserId, PasswordHash)
VALUES 
(@AdminId, @UserId, 'HASH_ADMIN_100');


SET @Child1 = UUID();
SET @Child2 = UUID();

INSERT INTO Children (Id, AdminId, Name, Coins, AvatarColor, PasswordHash)
VALUES
(@Child1, @AdminId, 'Oliver', 15, 'Cyan', 'HASH_OLIVER'),
(@Child2, @AdminId, 'Luna', 3, 'Magenta', 'HASH_LUNA');


INSERT INTO Quests (Id, ChildId, Title, Description, Reward, Status)
VALUES
(UUID(), @Child1, 'Clean Garage', 'Organize tools and sweep floor', 40, 'PENDING'),
(UUID(), @Child1, 'English Homework', 'Complete reading assignment', 20, 'COMPLETED'),
(UUID(), @Child2, 'Set the Table', 'Prepare table for dinner', 10, 'VERIFIED'),
(UUID(), @Child2, 'Practice Piano', 'Practice for 30 minutes', 25, 'PENDING');



/* =========================================
   STORED PROCEDURES
========================================= */

DELIMITER $$

CREATE PROCEDURE sp_AddQuest(
    IN p_ChildId CHAR(36),
    IN p_Title VARCHAR(200),
    IN p_Description TEXT,
    IN p_Reward INT
)
BEGIN
    INSERT INTO Quests (Id, ChildId, Title, Description, Reward, Status)
    VALUES (UUID(), p_ChildId, p_Title, p_Description, p_Reward, 'PENDING');
END$$


CREATE PROCEDURE sp_CompleteQuest(
    IN p_QuestId CHAR(36)
)
BEGIN
    UPDATE Quests
    SET Status = 'COMPLETED',
        CompletedAt = NOW()
    WHERE Id = p_QuestId
      AND Status = 'PENDING';
END$$


CREATE PROCEDURE sp_VerifyQuest(
    IN p_QuestId CHAR(36)
)
BEGIN
    DECLARE v_ChildId CHAR(36);
    DECLARE v_Reward INT;

    SELECT ChildId, Reward
    INTO v_ChildId, v_Reward
    FROM Quests
    WHERE Id = p_QuestId
      AND Status = 'COMPLETED';

    IF v_ChildId IS NOT NULL THEN

        START TRANSACTION;

        UPDATE Quests
        SET Status = 'VERIFIED',
            VerifiedAt = NOW()
        WHERE Id = p_QuestId;

        UPDATE Children
        SET Coins = Coins + v_Reward
        WHERE Id = v_ChildId;

        COMMIT;

    END IF;
END$$


CREATE PROCEDURE sp_GetChildDashboard(
    IN p_ChildId CHAR(36)
)
BEGIN
    SELECT *
    FROM Quests
    WHERE ChildId = p_ChildId
      AND Status IN ('PENDING','COMPLETED');

    SELECT *
    FROM Quests
    WHERE ChildId = p_ChildId
      AND Status = 'VERIFIED';
END$$


CREATE PROCEDURE sp_LoginUser(
    IN p_Email VARCHAR(100)
)
BEGIN
    SELECT Id, Username, PasswordHash
    FROM Users
    WHERE Email = p_Email;
END$$

DELIMITER ;