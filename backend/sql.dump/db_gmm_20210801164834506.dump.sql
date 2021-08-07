-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: db_gmm
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `gmm_attachments`
--

DROP TABLE IF EXISTS `gmm_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gmm_attachments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `file_size` int unsigned NOT NULL,
  `file_type` varchar(32) NOT NULL,
  `data` blob,
  `file_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gmm_attachments`
--

LOCK TABLES `gmm_attachments` WRITE;
/*!40000 ALTER TABLE `gmm_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `gmm_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gmm_posts`
--

DROP TABLE IF EXISTS `gmm_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gmm_posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int unsigned NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `content` text NOT NULL,
  `nb_views` int unsigned NOT NULL DEFAULT '0',
  `nb_comments` int unsigned NOT NULL DEFAULT '0',
  `id_attachment` int unsigned DEFAULT NULL,
  `is_topic` int unsigned DEFAULT '1',
  `date_creation` varchar(255) NOT NULL,
  `date_update` varchar(255) DEFAULT NULL,
  `nb_reactions` int unsigned NOT NULL DEFAULT '0',
  `reactions` varchar(255) NOT NULL DEFAULT '{"like":0, "love":0, "wow":0, "laugh":0, "dislike":0}',
  PRIMARY KEY (`id`),
  KEY `fk_posts_user` (`id_user`),
  CONSTRAINT `fk_posts_user` FOREIGN KEY (`id_user`) REFERENCES `gmm_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gmm_posts`
--

LOCK TABLES `gmm_posts` WRITE;
/*!40000 ALTER TABLE `gmm_posts` DISABLE KEYS */;
INSERT INTO `gmm_posts` VALUES (1,4,'Hello World','Welcome on the GroupoMania Media application.',0,0,NULL,1,'2021-07-21 10:00:00',NULL,0,'{\"like\":0, \"love\":0, \"wow\":0, \"laugh\":0, \"dislike\":0}'),(2,3,'','Fantastic.',0,0,NULL,0,'2021-07-21 10:02:00',NULL,0,'{\"like\":0, \"love\":0, \"wow\":0, \"laugh\":0, \"dislike\":0}'),(3,6,'','Thanks for that !',0,0,NULL,0,'2021-07-21 10:10:00',NULL,0,'{\"like\":0, \"love\":0, \"wow\":0, \"laugh\":0, \"dislike\":0}'),(4,3,'Nice Job','So what about now ?',0,0,NULL,1,'2021-07-21 10:20:00',NULL,0,'{\"like\":0, \"love\":0, \"wow\":0, \"laugh\":0, \"dislike\":0}'),(5,4,'','Updates are coming, I guess',0,0,NULL,0,'2021-07-21 10:25:00',NULL,0,'{\"like\":0, \"love\":0, \"wow\":0, \"laugh\":0, \"dislike\":0}'),(6,6,'Prez','So, my name is ... slim shady',0,0,NULL,1,'2021-07-21 10:30:00',NULL,0,'{\"like\":0, \"love\":0, \"wow\":0, \"laugh\":0, \"dislike\":0}'),(7,4,'','Nice to meet you',0,0,NULL,0,'2021-07-21 11:00:00',NULL,0,'{\"like\":0, \"love\":0, \"wow\":0, \"laugh\":0, \"dislike\":0}'),(8,6,'','So am I !',0,0,NULL,0,'2021-07-21 11:07:00',NULL,0,'{\"like\":0, \"love\":0, \"wow\":0, \"laugh\":0, \"dislike\":0}'),(9,4,'We need more Content','This database is soooo Empty :\'(',0,0,NULL,1,'2021-08-01 15:25:48',NULL,1,'{\"like\":0,\"love\":0,\"wow\":0,\"laugh\":1,\"dislike\":0}');
/*!40000 ALTER TABLE `gmm_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gmm_privileges`
--

DROP TABLE IF EXISTS `gmm_privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gmm_privileges` (
  `id` int unsigned NOT NULL,
  `name` varchar(16) NOT NULL,
  `create_message` varchar(4) DEFAULT '0',
  `edit_message` varchar(4) DEFAULT '0',
  `view_message` varchar(4) DEFAULT '0',
  `delete_message` varchar(4) DEFAULT '0',
  `edit_profil` varchar(4) DEFAULT '0',
  `view_profil` varchar(4) DEFAULT '0',
  `delete_profil` varchar(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gmm_privileges`
--

LOCK TABLES `gmm_privileges` WRITE;
/*!40000 ALTER TABLE `gmm_privileges` DISABLE KEYS */;
INSERT INTO `gmm_privileges` VALUES (1,'administrator','SELF','ALL','ALL','ALL','ALL','ALL','ALL'),(2,'moderator','SELF','ALL','ALL','ALL','ALL','ALL','0'),(3,'user','1','1','ALL','0','SELF','ALL','0'),(4,'visitor','0','0','ALL','0','0','0','0');
/*!40000 ALTER TABLE `gmm_privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gmm_topic_posts`
--

DROP TABLE IF EXISTS `gmm_topic_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gmm_topic_posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_topic` int unsigned NOT NULL,
  `id_post` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_topic_posts_post` (`id_post`),
  KEY `ind_topic` (`id_topic`),
  CONSTRAINT `fk_topic_posts_post` FOREIGN KEY (`id_post`) REFERENCES `gmm_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_topic_posts_topic` FOREIGN KEY (`id_topic`) REFERENCES `gmm_posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gmm_topic_posts`
--

LOCK TABLES `gmm_topic_posts` WRITE;
/*!40000 ALTER TABLE `gmm_topic_posts` DISABLE KEYS */;
INSERT INTO `gmm_topic_posts` VALUES (1,1,2),(2,1,3),(3,4,5),(4,6,7),(5,6,8);
/*!40000 ALTER TABLE `gmm_topic_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gmm_user_reactions`
--

DROP TABLE IF EXISTS `gmm_user_reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gmm_user_reactions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int unsigned NOT NULL,
  `id_post` int unsigned NOT NULL,
  `reaction` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_reactions_user` (`id_user`),
  KEY `fk_user_reactions_reaction` (`id_post`),
  CONSTRAINT `fk_user_reactions_reaction` FOREIGN KEY (`id_post`) REFERENCES `gmm_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_reactions_user` FOREIGN KEY (`id_user`) REFERENCES `gmm_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gmm_user_reactions`
--

LOCK TABLES `gmm_user_reactions` WRITE;
/*!40000 ALTER TABLE `gmm_user_reactions` DISABLE KEYS */;
INSERT INTO `gmm_user_reactions` VALUES (1,4,9,'laugh');
/*!40000 ALTER TABLE `gmm_user_reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gmm_users`
--

DROP TABLE IF EXISTS `gmm_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gmm_users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_privilege` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(512) NOT NULL,
  `date_naissance` datetime NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_connexion` datetime DEFAULT NULL,
  `id_avatar` int unsigned DEFAULT NULL,
  `service` varchar(64) DEFAULT NULL,
  `location` varchar(64) DEFAULT NULL,
  `signature` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_privilege` (`id_privilege`),
  CONSTRAINT `fk_users_privilege` FOREIGN KEY (`id_privilege`) REFERENCES `gmm_privileges` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gmm_users`
--

LOCK TABLES `gmm_users` WRITE;
/*!40000 ALTER TABLE `gmm_users` DISABLE KEYS */;
INSERT INTO `gmm_users` VALUES (1,1,'admin','admin@groupomedia.fr','$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa','1970-01-01 00:00:00','2021-07-20 10:57:00','2021-07-20 10:57:00',NULL,NULL,NULL,NULL),(2,2,'moderator','modjo@groupomedia.fr','$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa','1980-06-25 20:30:00','2021-07-20 10:58:00','2021-07-21 10:30:00',NULL,NULL,NULL,NULL),(3,4,'anonyme','ano@nym.a','nokey@userR3M0V3D','1980-01-01 00:00:00','2021-07-20 00:00:00','2021-07-21 00:00:00',NULL,NULL,NULL,NULL),(4,3,'boby','bobysait@gmail.com','$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa','1980-06-25 20:30:00','2021-07-20 10:58:00','2021-07-21 10:30:00',NULL,NULL,NULL,NULL),(5,3,'robin','robin@gmail.com','$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa','1973-08-12 20:10:00','2021-07-20 10:59:00','2021-07-20 10:59:00',NULL,NULL,NULL,NULL),(6,3,'caramel','cara123@caramail.fr','$2b$10$gaiwLlKFNN9tSGkd1JCiw.CfBqOUy1tAZGyNtpOwRqxjFuzsVqvXa','1985-02-03 10:20:00','2021-07-20 11:00:00','2021-07-20 11:00:00',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `gmm_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-01 18:48:34
