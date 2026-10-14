
CREATE DATABASE IF NOT EXISTS gamevault
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gamevault;


CREATE TABLE IF NOT EXISTS `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    age_rating VARCHAR(10) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS purchase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'completed',

    CONSTRAINT fk_purchase_user
        FOREIGN KEY (user_id)
        REFERENCES `user`(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS purchase_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    game_id INT NOT NULL,
    price_paid DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_purchase_item_purchase
        FOREIGN KEY (purchase_id)
        REFERENCES purchase(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_purchase_item_game
        FOREIGN KEY (game_id)
        REFERENCES game(id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    rating TINYINT NOT NULL,
    comment TEXT,
    hours_played DECIMAL(6,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES `user`(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_game
        FOREIGN KEY (game_id)
        REFERENCES game(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_review_rating
        CHECK (rating BETWEEN 1 AND 5)
);


CREATE TABLE IF NOT EXISTS tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS review_tag (
    review_id INT NOT NULL,
    tag_id INT NOT NULL,

    PRIMARY KEY (review_id, tag_id),

    CONSTRAINT fk_review_tag_review
        FOREIGN KEY (review_id)
        REFERENCES review(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_tag_tag
        FOREIGN KEY (tag_id)
        REFERENCES tag(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS achievement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('simple', 'progressive', 'timestamped') NOT NULL,
    target_value INT,

    CONSTRAINT fk_achievement_game
        FOREIGN KEY (game_id)
        REFERENCES game(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS user_achievement (
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    progress INT DEFAULT 0,
    unlocked_at TIMESTAMP NULL,

    PRIMARY KEY (user_id, achievement_id),

    CONSTRAINT fk_user_achievement_user
        FOREIGN KEY (user_id)
        REFERENCES `user`(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_achievement_achievement
        FOREIGN KEY (achievement_id)
        REFERENCES achievement(id)
        ON DELETE CASCADE
);


SHOW TABLES;

SELECT
    TABLE_NAME,
    COLUMN_NAME,
    COLUMN_TYPE,
    COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'gamevault'
ORDER BY TABLE_NAME, ORDINAL_POSITION;

SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'gamevault'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;
