-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: shop
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

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
-- Table structure for table `advertisement`
--

DROP TABLE IF EXISTS `advertisement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advertisement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advertisement`
--

LOCK TABLES `advertisement` WRITE;
/*!40000 ALTER TABLE `advertisement` DISABLE KEYS */;
/*!40000 ALTER TABLE `advertisement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` int NOT NULL DEFAULT '0',
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (2,NULL,0,'hah00023'),(3,'/static/1735704224915-255268423.png',0,'string123'),(4,NULL,2,'string'),(5,NULL,2,'string'),(6,NULL,3,'string'),(7,NULL,2,'string'),(8,'/static/1735704610501-399732290.png',0,'嘎嘎'),(9,'/static/1735704243541-901275132.png',0,'string123'),(10,'/static/1735799831758-88982373.png',0,'tr11'),(11,'/static/1735704513975-986586494.png',10,'tsssssssr'),(12,NULL,0,'tsssssssr'),(13,'/static/1735707159224-815984705.png',0,'tsssssssr'),(14,NULL,0,'tsssssssr'),(15,NULL,10,'从15'),(16,NULL,0,'1234567890123456'),(17,NULL,0,'1234567890123456'),(18,NULL,0,'test validate'),(19,NULL,0,'test validate'),(20,'/static/1735798642598-712995716.png',0,'test validate');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collect`
--

DROP TABLE IF EXISTS `collect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collect` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `targetId` int NOT NULL,
  `targetType` enum('product','sets') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collect`
--

LOCK TABLES `collect` WRITE;
/*!40000 ALTER TABLE `collect` DISABLE KEYS */;
/*!40000 ALTER TABLE `collect` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `star` int DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `pictures` text COLLATE utf8mb4_unicode_ci,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `targetId` int NOT NULL,
  `targetType` enum('product','sets') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,5,1,NULL,'2024-12-19 08:55:11.838891','2025-01-03 05:13:34.000000','??','haga','approved',0,'product'),(3,15,2,1,'2024-12-19 09:04:31.446838','2025-01-03 04:29:32.000000','31231,qqq','string','approved',0,'product'),(4,5,1,1,'2024-12-19 09:04:34.759372','2025-01-03 05:13:34.000000','31231,qqq','string','approved',0,'product');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration`
--

DROP TABLE IF EXISTS `configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` json NOT NULL,
  `key` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration`
--

LOCK TABLES `configuration` WRITE;
/*!40000 ALTER TABLE `configuration` DISABLE KEYS */;
INSERT INTO `configuration` VALUES (50,'{\"name\": \"士大12\", \"description\": \"地方11\"}','basic');
/*!40000 ALTER TABLE `configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('cut','percentage') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cut',
  `needFull` int NOT NULL,
  `receiveLimit` int NOT NULL,
  `target` enum('order','product') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'order',
  `totalQuantity` int NOT NULL,
  `remainingQuantity` int NOT NULL,
  `startDate` timestamp NOT NULL,
  `endDate` timestamp NOT NULL,
  `createDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` enum('off','on') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES (1,'cut',100,10,'product',10,10,'2024-12-19 02:08:31','2024-12-19 02:46:53','2024-12-19 02:16:29.004817','2025-01-04 03:36:27.145251','off','test description',0),(3,'cut',100,1,'product',10,10,'2024-12-11 00:00:00','2024-12-17 00:00:00','2024-12-19 02:17:36.127268','2025-01-04 03:37:04.000000','on','test 2',1),(8,'percentage',123,1,'order',13,5,'2025-01-14 00:00:00','2025-01-26 00:00:00','2025-01-04 03:34:17.659814','2025-01-04 03:34:17.659814','on','wfswe',12);
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_products_product`
--

DROP TABLE IF EXISTS `coupon_products_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_products_product` (
  `couponId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`couponId`,`productId`),
  KEY `IDX_006cd586575d86f4705186b869` (`couponId`),
  KEY `IDX_bdd320620afd063015fa0976ae` (`productId`),
  CONSTRAINT `FK_006cd586575d86f4705186b869a` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_bdd320620afd063015fa0976ae1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_products_product`
--

LOCK TABLES `coupon_products_product` WRITE;
/*!40000 ALTER TABLE `coupon_products_product` DISABLE KEYS */;
INSERT INTO `coupon_products_product` VALUES (1,1),(1,2),(3,1),(3,5),(8,4),(8,6),(8,7);
/*!40000 ALTER TABLE `coupon_products_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `payTime` timestamp NULL DEFAULT NULL,
  `expectTime` timestamp NOT NULL,
  `finishTime` timestamp NULL DEFAULT NULL,
  `status` enum('wait_pay','wait_handle','handling','finished','cancel','removed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wait_pay',
  `orderType` enum('in_shop','user_self') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payType` enum('default') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `couponIds` text COLLATE utf8mb4_unicode_ci,
  `payAmount` float NOT NULL,
  `amount` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (26,19,'','2025-01-23 08:57:17.580935',NULL,'2025-01-23 08:54:17',NULL,'removed','in_shop',NULL,'',12,123),(27,19,'','2025-02-07 05:52:59.631995','2025-02-08 06:07:55','2025-02-07 05:52:18',NULL,'cancel','in_shop','default','',37.12,153),(28,19,'','2025-02-07 05:53:56.980688',NULL,'2025-02-07 05:52:18',NULL,'wait_pay','in_shop',NULL,'',37.12,153),(29,19,'','2025-02-07 06:06:35.220421',NULL,'2025-02-07 05:59:39',NULL,'wait_pay','in_shop',NULL,'',12,123),(30,19,'','2025-02-07 08:51:54.765332',NULL,'2025-02-07 08:51:51',NULL,'wait_pay','in_shop',NULL,'',50.24,60),(31,19,'','2025-03-27 05:16:19.033643','2025-03-27 05:16:46','2025-03-27 05:16:15',NULL,'wait_handle','in_shop','default','',24,246);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `targetId` int NOT NULL,
  `quantity` int NOT NULL,
  `chooseOption` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('product','sets') COLLATE utf8mb4_unicode_ci NOT NULL,
  `useCoupon` int DEFAULT NULL,
  `totalAmount` float NOT NULL,
  `discountAmount` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_88850b85b38a8a2ded17a1f5369` (`orderId`),
  CONSTRAINT `FK_88850b85b38a8a2ded17a1f5369` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (1,26,2,1,'6','product',NULL,123,12),(2,27,2,1,'6','product',NULL,123,12),(3,27,2,2,'2','product',NULL,30,25.12),(4,28,2,1,'6','product',NULL,123,12),(5,28,2,2,'2','product',NULL,30,25.12),(6,29,2,1,'6','product',NULL,123,12),(7,30,2,4,'2','product',NULL,60,50.24),(8,31,2,2,'6','product',NULL,246,24);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pictures` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `status` enum('on','off') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `categoryId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'st112ri323ng','/static/1735971737765-534956925.png','/static/1735972171029-32670074.png,/static/1735972448134-634965416.png','string','2025-01-14 06:31:19.843678','2024-12-18 02:01:00.104103','on',8),(2,'st112ri323ng','/static/1735971665400-939488351.png','/static/1735972472893-864694462.png','string','2025-01-14 06:31:19.843678','2024-12-18 02:01:20.078972','on',8),(3,'test123','/static/1735800122277-525538734.png','/static/1735800113016-858061236.png,/static/1735800111138-64913744.png,/static/1735800116471-877055279.png,/static/1735800118259-33311396.png,/static/1735972482172-798642462.png','test','2025-01-14 06:31:19.843678','2024-12-18 02:02:12.157578','on',8),(4,'test123','avatar.png','/static/1735971718887-645900189.png','test1','2025-01-14 06:31:19.843678','2024-12-18 02:02:14.904911','on',8),(5,'????update','avatar.png','1.png,2.png','test555','2025-01-14 06:31:19.843678','2024-12-18 02:02:18.418873','on',8),(6,'test123','avatar.png','1.png,2.png','test3','2025-01-14 06:31:19.843678','2024-12-18 02:02:26.400243','on',8),(7,'test123','avatar.png','1.png,2.png','test555','2025-01-14 06:31:19.843678','2024-12-18 02:02:30.978308','on',8),(10,'123','/static/1735783046472-110165321.png','/static/1735783053083-312127647.png,/static/1735972502138-824727626.png','1111111111111','2025-01-14 06:25:18.899608','2025-01-02 02:08:50.158604','on',8);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_option`
--

DROP TABLE IF EXISTS `product_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int DEFAULT NULL,
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` float NOT NULL,
  `originalPrice` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2ca1aab0a82e9c0058d8465ad02` (`productId`),
  CONSTRAINT `FK_2ca1aab0a82e9c0058d8465ad02` FOREIGN KEY (`productId`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_option`
--

LOCK TABLES `product_option` WRITE;
/*!40000 ALTER TABLE `product_option` DISABLE KEYS */;
INSERT INTO `product_option` VALUES (2,2,'请求111',12.56,15),(4,2,'1111',0,0),(6,2,'为',12,123);
/*!40000 ALTER TABLE `product_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `received_coupon`
--

DROP TABLE IF EXISTS `received_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `received_coupon` (
  `couponId` int NOT NULL,
  `userId` int NOT NULL,
  `hasUsed` tinyint NOT NULL DEFAULT '0',
  `addTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`couponId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `received_coupon`
--

LOCK TABLES `received_coupon` WRITE;
/*!40000 ALTER TABLE `received_coupon` DISABLE KEYS */;
INSERT INTO `received_coupon` VALUES (3,5,0,'2024-12-19 04:31:47.362080');
/*!40000 ALTER TABLE `received_coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sets`
--

DROP TABLE IF EXISTS `sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('cut','percentage') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cut',
  `amount` float NOT NULL,
  `categoryId` int NOT NULL,
  `status` enum('on','off') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sets`
--

LOCK TABLES `sets` WRITE;
/*!40000 ALTER TABLE `sets` DISABLE KEYS */;
INSERT INTO `sets` VALUES (2,'test sets 1','test1.png','test sets 1','cut',1.02,9,'off','2025-01-16 09:05:31.000107','2025-01-16 09:05:31.009831'),(3,'test sets 1','test1.png','test sets 1','cut',0,8,'off','2025-01-16 09:05:31.000107','2025-01-16 09:05:31.009831'),(4,'士大夫','/static/1735875038642-136035557.png','test sets 1','cut',0,9,'off','2025-01-16 09:05:31.000107','2025-01-16 09:05:31.009831'),(8,'haha123','test','test sets 1','cut',0,9,'on','2025-01-16 09:05:31.000107','2025-01-16 09:32:26.000000'),(9,'test sets 1','test1.png','test sets 1','cut',0,9,'off','2025-01-16 09:05:31.000107','2025-01-16 09:05:31.009831'),(10,'test sets 1','test','test sets 1','cut',0,9,'off','2025-01-16 09:05:31.000107','2025-01-16 09:05:31.009831'),(11,'123','/static/1735873265341-582215422.png','123','percentage',1,9,'off','2025-01-16 09:05:31.000107','2025-01-16 09:05:31.009831'),(12,'士大夫','/static/1736862141622-770985106.png','撒士大夫首发式地方','cut',123,18,'off','2025-01-16 09:05:31.000107','2025-01-16 09:05:31.009831'),(13,'11111','/static/1737020188323-519101780.png','11111','cut',1,8,'on','2025-01-16 09:37:31.578507','2025-01-16 09:37:31.578507');
/*!40000 ALTER TABLE `sets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sets_products_product`
--

DROP TABLE IF EXISTS `sets_products_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sets_products_product` (
  `setsId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`setsId`,`productId`),
  KEY `IDX_890c366e2218a8eea32832fb17` (`setsId`),
  KEY `IDX_1127272c1fca9542f2b0e63436` (`productId`),
  CONSTRAINT `FK_1127272c1fca9542f2b0e63436d` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_890c366e2218a8eea32832fb170` FOREIGN KEY (`setsId`) REFERENCES `sets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sets_products_product`
--

LOCK TABLES `sets_products_product` WRITE;
/*!40000 ALTER TABLE `sets_products_product` DISABLE KEYS */;
INSERT INTO `sets_products_product` VALUES (2,4),(3,3),(4,5),(8,5),(10,2),(11,6),(11,7),(12,3),(12,5),(13,7),(13,10);
/*!40000 ALTER TABLE `sets_products_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('on','off','removed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'on',
  `createTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `lastLoginTime` timestamp NULL DEFAULT NULL,
  `telNumber` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (19,'tom','/static/1735798299701-396991057.png','on','2024-12-27 06:19:45.857669','2025-03-27 05:16:11.000000','2025-03-27 05:16:12','16312341231','202cb962ac59075b964b07152d234b70','admin,user'),(20,'ttt','/static/1735545475503-670049909.png','off','2024-12-27 06:46:32.802136','2025-01-01 04:24:40.000000','2024-12-30 07:57:24','13141111234','f7e0ef389ac6133c88aedbd66b44a4e1','user'),(21,'te123','/static/1735548092133-998516656.png','on','2024-12-28 05:29:26.552782','2024-12-30 08:41:32.000000','2024-12-30 08:41:25','12312341230','202cb962ac59075b964b07152d234b70','admin,user'),(22,'123',NULL,'on','2025-01-01 04:38:09.318681','2025-01-01 04:42:24.000000','2025-01-01 04:42:24','11112341234','202cb962ac59075b964b07152d234b70','admin,user');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-29 13:30:11
