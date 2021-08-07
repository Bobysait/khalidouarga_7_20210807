-- --------------------------------------------------------------------------- --
-- SQL SCRIPT --
-- --------------------------------------------------------------------------- --

-- gmm : the GroupOMania Media --
-- password for administrator 'gmm_admin' need to be defined on line 25 --
-- password for user 'gmm_user' need to be defined on line 30 --

-- --------------------------------------------------------------------------- --


-- release old database if exists --

DROP DATABASE IF EXISTS db_gmm;


-- create database for groupamania application --

CREATE DATABASE IF NOT EXISTS db_gmm CHARACTER SET 'utf8';

FLUSH PRIVILEGES;

-- create an administrator for this database --
DROP USER IF EXISTS 'gmm_admin'@'localhost';
CREATE USER 'gmm_admin'@'localhost' IDENTIFIED BY 'XXXXXX';
GRANT ALL PRIVILEGES ON db_gmm.* TO 'gmm_admin'@'localhost';

-- select the database for use --


USE db_gmm;



-- CREATE TABLES --

	-- users privileges --

	DROP TABLE IF EXISTS `gmm_privileges`;
	CREATE TABLE `gmm_privileges` (
		`id`				INT UNSIGNED NOT NULL,
		`name`				VARCHAR(16) NOT NULL,
		`is_owner`			INT UNSIGNED DEFAULT 0,
		`is_admin`			INT UNSIGNED DEFAULT 0,
		`create_message`	INT UNSIGNED DEFAULT 0,
		`edit_message`		INT UNSIGNED DEFAULT 0,
		`view_message`		INT UNSIGNED DEFAULT 0,
		`delete_message`	INT UNSIGNED DEFAULT 0,
		`edit_user`			INT UNSIGNED DEFAULT 0,
		`view_user`			INT UNSIGNED DEFAULT 0,
		`delete_user`		INT UNSIGNED DEFAULT 0,
		`disconnect`		INT UNSIGNED DEFAULT 0,
		PRIMARY KEY (`id`)
	)
	ENGINE=INNODB;
	
	
	-- USERS --

	DROP TABLE IF EXISTS `gmm_users`;
	CREATE TABLE `gmm_users` (
		`id`				INT UNSIGNED NOT NULL AUTO_INCREMENT,
		`id_privilege`		INT UNSIGNED NOT NULL,
		`name`				VARCHAR(255) NOT NULL,
		`email`				VARCHAR(255) NOT NULL UNIQUE,
		`password`			VARCHAR(512) NOT NULL,
		`date_naissance`	DATETIME DEFAULT CURRENT_TIMESTAMP,
		`date_creation`		DATETIME DEFAULT CURRENT_TIMESTAMP,
		`date_connexion`	DATETIME DEFAULT CURRENT_TIMESTAMP,
		`url_avatar`		VARCHAR(255) DEFAULT NULL,
		`service`			VARCHAR(64) DEFAULT NULL,
		`location`			VARCHAR(64) DEFAULT NULL,
		`signature`			VARCHAR(128) DEFAULT NULL,
		PRIMARY KEY (`id`),
		CONSTRAINT `fk_users_privilege` FOREIGN KEY (`id_privilege`) REFERENCES gmm_privileges(`id`)
	)
	ENGINE=INNODB;

	
	-- POSTS --
	
	DROP TABLE IF EXISTS `gmm_posts`;
	CREATE TABLE `gmm_posts` (
		`id`				INT UNSIGNED NOT NULL AUTO_INCREMENT,
		`id_user`			INT UNSIGNED NOT NULL,
		`title`				VARCHAR(128) DEFAULT NULL,
		`content`			TEXT NOT NULL,
		`nb_views`			INT UNSIGNED DEFAULT 0 NOT NULL,
		`nb_comments`		INT UNSIGNED DEFAULT 0 NOT NULL,
		`url_attachment`	VARCHAR(255) DEFAULT NULL,
		`id_attachment`		INT UNSIGNED DEFAULT NULL,
		`is_topic`			INT UNSIGNED DEFAULT 1,
		`date_creation`		DATETIME DEFAULT CURRENT_TIMESTAMP,
		`date_update`		DATETIME DEFAULT CURRENT_TIMESTAMP,
		`nb_reactions`		INT UNSIGNED NOT NULL DEFAULT 0,
		`reactions`			VARCHAR(255) NOT NULL DEFAULT '{"like":0, "love":0, "wow":0, "laugh":0, "dislike":0}',
		PRIMARY KEY (`id`),
		CONSTRAINT `fk_posts_user` FOREIGN KEY (`id_user`) REFERENCES gmm_users(`id`) ON DELETE CASCADE
	)
	ENGINE=INNODB;
	
	-- comments on a topic (link the posts to the related topic) --
	
	DROP TABLE IF EXISTS `gmm_topic_posts`;
	CREATE TABLE `gmm_topic_posts` (
		`id`				INT UNSIGNED NOT NULL AUTO_INCREMENT,
		`id_topic`			INT UNSIGNED NOT NULL,
		`id_post`			INT UNSIGNED NOT NULL,
		PRIMARY KEY (`id`),
		CONSTRAINT `fk_topic_posts_topic` FOREIGN KEY (`id_topic`) REFERENCES gmm_posts(`id`) ON DELETE CASCADE,
		CONSTRAINT `fk_topic_posts_post` FOREIGN KEY (`id_post`) REFERENCES gmm_posts(`id`) ON DELETE CASCADE,
		INDEX ind_topic (`id_topic`)
	)
	ENGINE=INNODB;
	
	
	-- link users <-> reactions --
	
	DROP TABLE IF EXISTS `gmm_user_reactions`;
	CREATE TABLE `gmm_user_reactions` (
		`id`				INT UNSIGNED NOT NULL AUTO_INCREMENT,
		`id_user`			INT UNSIGNED NOT NULL,
		`id_post`			INT UNSIGNED NOT NULL,
		`reaction`			VARCHAR(10) NOT NULL,
		PRIMARY KEY (`id`),
		CONSTRAINT `fk_user_reactions_user` FOREIGN KEY (`id_user`) REFERENCES gmm_users(`id`) ON DELETE CASCADE,
		CONSTRAINT `fk_user_reactions_reaction` FOREIGN KEY (`id_post`) REFERENCES gmm_posts(`id`) ON DELETE CASCADE
	)
	ENGINE=INNODB;



-- Insert default data / configuration --

INSERT INTO `gmm_privileges` (`id`, `name`, `is_owner`, `is_admin`, `create_message`, `edit_message`, `view_message`, `delete_message`, `edit_user`, `view_user`, `delete_user`, `disconnect`) VALUES 
							(    1, 'owner'			, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2),
							(    2, 'administrator'	, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2),
							(    3, 'moderator'		, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2),
							(    4, 'user'			, 0, 0, 1, 1, 2, 0, 1, 2, 0, 1),
							(    5, 'visitor'		, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0);




-- Insert "random" data into tables to fill and test the application --

INSERT INTO `gmm_users` (`id`, `id_privilege`, `name`, `email`, `password`, `date_naissance`) values
	(NULL, 1, 'owner', 'owner@groupomedia.fr', '$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa', '1970-01-01 00:00:00'),
	(NULL, 2, 'admin', 'admin@groupomedia.fr', '$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa', '1970-01-01 00:00:00'),
	(NULL, 3, 'moderator', 'modjo@groupomedia.fr', '$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa', '1980-06-25 20:30:00'),
	(NULL, 5, 'anonyme', 'ano@nym.a', 'nokey@userR3M0V3D', '1980-01-01 00:00:00'),
	(NULL, 4, 'boby', 'bobysait@gmail.com', '$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa', '1980-06-25 20:30:00'),
	(NULL, 4, 'robin', 'robin@gmail.com', '$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa', '1973-08-12 20:10:00'),
	(NULL, 4, 'caramel', 'cara123@caramail.fr', '$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa', '1985-02-03 10:20:00');


INSERT INTO `gmm_posts` (`id_user`, `date_creation`, `title`, `content`, `is_topic`) values
	(5, '2021-07-21 10:00:00', 'Hello World', 'Welcome on the GroupoMania Media application.', 1),
	(6, '2021-07-21 10:02:00', '', 'Fantastic.', 0),
	(7, '2021-07-21 10:10:00', '', 'Thanks for that !', 0),
	(6, '2021-07-21 10:20:00', 'Nice Job', 'So what about now ?', 1),
	(5, '2021-07-21 10:25:00', '', 'Updates are coming, I guess', 0),
	(7, '2021-07-21 10:30:00', 'Prez', 'So, my name is ... slim shady', 1),
	(5, '2021-07-21 11:00:00', '', 'Nice to meet you', 0),
	(7, '2021-07-21 11:07:00', '', 'So am I !', 0),
	(7, '2021-07-21 12:30:00', 'Time to eat', 'there is always a moment ... we need to eat', 1);

INSERT INTO `gmm_topic_posts` (`id_topic`, `id_post`) values
	(1,2),
	(1,3),
	(4,5),
	(6,7),
	(6,8);

