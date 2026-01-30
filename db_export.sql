mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: ebazer_shop
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `title` varchar(50) DEFAULT 'Home',
  `address_line1` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Saudi Arabia',
  `phone` varchar(20) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES ('0d528ce9-b104-41f2-8b40-3b90a21d3e92','319028f2-fd01-11f0-a8c3-d6c7b7971942','Hadayek Al Ahram, Kafr Nassar','Hadayek Al Ahram, Kafr Nassar','Al Haram','╪º┘ä┘é╪º┘ç╪▒╪⌐ ΓÇö Cairo Governorate','3387722','Saudi Arabia','01080105104',1,'2026-01-29 11:39:22','2026-01-29 11:39:22'),('587fe306-e15d-4f65-8864-ac5375d20d41','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','32 Al Falki','32 Al Falki','Abdeen','╪º┘ä┘é╪º┘ç╪▒╪⌐','4280102','Saudi Arabia','555555555555',1,'2026-01-18 11:56:28','2026-01-18 11:56:28'),('59c17746-3a30-4eff-a9c0-8798f8a65919','ed79081b-f2d2-11f0-9277-cef9761140b6','ddddd','122dfdf','ffdfd','dfffd','1223323','Saudi Arabia','01121106662',1,'2026-01-16 12:01:42','2026-01-16 12:01:42'),('cd3fe057-901f-41f9-aa34-72c0acac04ff','0ceb68b4-f204-11f0-a020-82903bb0556b','Home','123 Test St','TestCity',NULL,'12345','TestLand','111222333',0,'2026-01-15 21:13:44','2026-01-15 21:13:44'),('ce3f921e-9ea8-42fb-adec-39dfb5c0aeb8','0e5fea0e-f5da-11f0-ac31-fee8668bd513','erfds','cairo , 1','cairo','jeddah','11111','Saudi Arabia','+201121106662',1,'2026-01-20 08:29:43','2026-01-20 08:29:43'),('d342ea8f-5793-4dd7-8304-0867863306a5','6bd5edd3-f24b-11f0-913d-1ae0eff90505','tyyyyyyy','32 Al Falki','Abdeen','╪º┘ä┘é╪º┘ç╪▒╪⌐','4280102','Egypt','',1,'2026-01-15 21:05:49','2026-01-15 21:05:49'),('f035fa1c-fa69-47a3-b443-ae21f625a6e5','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','FFF','FGDD ,GFR','WSF','SSE','WSSD','Saudi Arabia','323333343443',1,'2026-01-26 10:10:13','2026-01-26 10:10:13');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics_events`
--

DROP TABLE IF EXISTS `analytics_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_type` enum('page_view','product_view','add_to_cart','checkout_start','purchase') NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `visitor_id` varchar(100) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_events`
--

LOCK TABLES `analytics_events` WRITE;
/*!40000 ALTER TABLE `analytics_events` DISABLE KEYS */;
INSERT INTO `analytics_events` VALUES (1,'page_view',NULL,'2b8b3fd9-477c-4764-aa84-831fce12aba1','::ffff:127.0.0.1','Unknown','Unknown','{}','2026-01-30 01:22:16');
/*!40000 ALTER TABLE `analytics_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` char(36) NOT NULL,
  `cart_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `variant_id` char(36) DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart_item` (`cart_id`,`product_id`,`variant_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  KEY `idx_cart_items_cart` (`cart_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` char(36) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `name_ar` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `description_en` text,
  `description_ar` text,
  `image_url` text,
  `parent_id` char(36) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('0a1fdb2b-8fe1-4c7a-9ebc-9048e18af8ef','Dresses','Dresses','dresses',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41'),('3eb1e3e7-87a5-41a5-b9d5-83d76b984898','Jumpsuits','Jumpsuits','jumpsuits',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41'),('42990a2e-6fa7-4ae4-b80c-1c957b6925dd','Vests','Vests','vests',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41'),('54b998a3-2ba5-4903-aa55-af3e9ccf2d42','Uncategorized','Uncategorized','uncategorized',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41'),('99e4cd8a-d7e0-41b0-8068-b8318647a784','Tops','Tops','tops',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41'),('9ac81e0c-147d-4040-ad76-638320026eb0','Trousers','Trousers','trousers',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41'),('ecdfa51a-1c2e-4822-85a4-43205b7eddd4','Skirts','Skirts','skirts',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41'),('ed5705a3-0a9f-40d1-a8af-446a9661058c','Mix & Match','Mix & Match','mix-match',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41'),('f4d68212-6998-46c8-9940-9276c708958a','New Arrivals','New Arrivals','new-arrivals',NULL,NULL,NULL,NULL,0,1,'2026-01-29 12:29:41','2026-01-29 12:29:41');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `usage_count` int DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'active',
  `is_deleted` tinyint(1) DEFAULT '0',
  `user_specific_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'TEST','percentage',50.00,'2026-01-25 00:00:00','2026-01-26 00:00:00',NULL,0,'active',0,NULL,'2026-01-25 08:41:32'),(15,'TEST2','percentage',20.00,'2026-01-25 00:00:00','2026-01-26 00:00:00',NULL,0,'active',0,NULL,'2026-01-25 19:20:54');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text,
  `data` json DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  KEY `idx_notifications_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `product_id` char(36) DEFAULT NULL,
  `variant_id` char(36) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `variant_info` text,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `item_status` varchar(50) DEFAULT 'active',
  `cancel_reason` text,
  `refund_status` enum('idle','requested','approved','rejected') DEFAULT 'idle',
  `refund_reason` varchar(255) DEFAULT NULL,
  `refund_quantity` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  KEY `idx_order_items_order` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `status` varchar(50) NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `order_number` varchar(50) DEFAULT 'ORD-TEMP',
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `delivery_id` varchar(100) DEFAULT NULL,
  `delivery_status` varchar(50) DEFAULT 'pending',
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) DEFAULT '0.00',
  `tax_amount` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'SAR',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded','refund_requested') NOT NULL DEFAULT 'pending',
  `shipping_address` json DEFAULT NULL,
  `shipping_name` varchar(255) DEFAULT NULL,
  `shipping_phone` varchar(50) DEFAULT NULL,
  `shipping_city` varchar(100) DEFAULT NULL,
  `shipping_zip` varchar(20) DEFAULT NULL,
  `billing_address` json DEFAULT NULL,
  `notes` text,
  `promo_code_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `unit_price` decimal(10,2) DEFAULT '0.00',
  `product_name` varchar(255) DEFAULT NULL,
  `refund_requests` json DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT '0',
  `paid_at` datetime DEFAULT NULL,
  `is_delivered` tinyint(1) DEFAULT '0',
  `delivered_at` datetime DEFAULT NULL,
  `payment_result` json DEFAULT NULL,
  `delivery_error` text,
  `tracking_number` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `promo_code_id` (`promo_code_id`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_created_at` (`created_at` DESC),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('03284bad-4d3e-45cb-a479-98e5147e7b25','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769365087532861','cancelled',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-25 18:18:07','2026-01-25 19:18:50',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('0429c6b3-4a74-4812-80b1-6556f1f8981e','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768741752858675','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"\", \"firstName\": \"\"}',' ','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 13:09:12','2026-01-18 13:09:12',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('08ab7c6a-51b7-4838-99b2-2ec5a8c26859','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769174731183676','delivered',NULL,'pending',33.00,0.00,0.00,0.00,33.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-23 13:25:31','2026-01-24 12:07:18',0.00,0.00,NULL,'[{\"items\": [\"40a65dfd-dfc2-46e7-b4b2-b618b0bdb3f3\", \"4739e379-65e0-40e3-9cfd-5f6eb54f3abe\"], \"phone\": \"222222\", \"reason\": \"sssss\", \"status\": \"rejected\", \"address\": \"32 Al Falki\", \"createdAt\": \"2026-01-24T10:29:02.882Z\", \"requestId\": \"0b67c8a5-ec04-4281-8488-483349519eb6\", \"pickupTime\": \"2026-01-24T16:28\"}]',0,NULL,0,NULL,NULL,NULL,NULL),('0b707f8f-0c60-4ad8-a991-d8c28974f371','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-17687623967170','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 18:53:16','2026-01-18 18:53:16',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('1cde162b-4589-420c-8758-4783fd7e701e','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-176875955508488','pending',NULL,'pending',129.99,0.00,0.00,0.00,129.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 18:05:55','2026-01-18 18:05:55',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('2093bf74-c2eb-4b53-853a-a7f89fe42987','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-17695186010830','pending',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 12:56:41','2026-01-27 12:56:41',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('2bdf73f0-fc55-4771-b8bd-46007263440b','6747412c-fb88-11f0-bc51-86524b96cef6','ORD-1769522373126202','confirmed',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR','cod','pending','{\"city\": \"Riyadh\", \"email\": \"testuser_1769522368931@example.com\", \"phone\": \"0555555555\", \"address\": \"123 Test St\", \"country\": \"Saudi Arabia\", \"zipCode\": \"12345\", \"lastName\": \"User\", \"firstName\": \"Test\"}','Test User','0555555555','Riyadh','12345',NULL,NULL,NULL,'2026-01-27 13:59:33','2026-01-29 11:20:54',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('30af3973-3873-4f73-9e45-7845fb505b65','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-176951527110042','pending',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 12:01:11','2026-01-27 12:01:11',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('397275d0-15f4-4526-a07a-d82f82fbd040','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769513640683659','pending',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 11:34:00','2026-01-27 11:34:00',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('3d8620d8-a788-406e-9783-1aafda254fef','test-user-id','ORD-1768984171752288','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"zip\": \"12345\", \"city\": \"Notification City\", \"phone\": \"555-0123\", \"address\": \"123 Event Bus Lane\", \"country\": \"Saudi Arabia\", \"lastName\": \"User\", \"firstName\": \"Test\"}','Test User','555-0123','Notification City','12345',NULL,NULL,NULL,'2026-01-21 08:29:31','2026-01-21 08:29:31',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('3de37e3f-6dba-4ab8-969d-534551a128c7','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768740553975513','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"\", \"firstName\": \"\"}',' ','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 12:49:14','2026-01-18 12:49:14',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('44d938ed-8919-4e86-99ab-fa25b8844eb9','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768765986875507','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 19:53:06','2026-01-18 19:53:06',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('4ab8fe1c-db2c-44f2-b11f-b2a4e14a676c','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768759888266535','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 18:11:28','2026-01-18 18:11:28',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('5432f532-5bb7-4838-99cb-0b918d1b9956','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769331029632662','cancelled',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-25 08:50:29','2026-01-25 19:18:44',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('5c3e8e91-808d-4e84-b496-4d579860369f','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769175218948110','delivered',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-23 13:33:38','2026-01-24 11:00:57',0.00,0.00,NULL,'[{\"items\": [\"3b7c9e1d-3eb7-4dab-a7f2-93a23af7806c\"], \"phone\": \"ssss\", \"reason\": \"ssss\", \"status\": \"approved\", \"address\": \"s\", \"createdAt\": \"2026-01-24T10:38:22.927Z\", \"requestId\": \"fbc91bc8-27df-4b82-ac54-cc72a2d92b49\", \"pickupTime\": \"2026-01-24T15:38\"}]',0,NULL,0,NULL,NULL,NULL,NULL),('62bc6735-302e-4ce3-b642-f03909e0ae55','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769513618567699','pending',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 11:33:38','2026-01-27 11:33:38',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('62bfced7-3157-49af-b8eb-937d971203dd','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768761032035688','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 18:30:32','2026-01-18 18:30:32',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('6fb06d59-9e56-4efb-9e7f-763f5e10f290','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769331040752753','pending',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-25 08:50:40','2026-01-25 08:50:40',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('6ff2ab3d-9174-4f8d-8456-cfe9478bd783','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769545513274593','confirmed',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR','cod','pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 20:25:13','2026-01-29 11:20:13',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('72d3e2c6-0e09-4b6c-8444-bdca1301933f','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768758512738537','pending',NULL,'pending',399.98,0.00,0.00,0.00,399.98,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"\", \"firstName\": \"\"}',' ','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 17:48:32','2026-01-18 17:48:32',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('736989b3-03c1-4b05-b210-10e3e50faed7','0e5fea0e-f5da-11f0-ac31-fee8668bd513','ORD-1768902913319116','pending',NULL,'pending',89.97,0.00,0.00,0.00,89.97,'SAR',NULL,'pending','{\"city\": \"cairo\", \"email\": \"\", \"phone\": \"+201121106662\", \"state\": \"jeddah\", \"address\": \"cairo , 1\", \"country\": \"Saudi Arabia\", \"zipCode\": \"11111\", \"lastName\": \"\", \"firstName\": \"\"}',' ','+201121106662','cairo','11111',NULL,NULL,NULL,'2026-01-20 09:55:13','2026-01-20 09:55:13',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('74ad95aa-0887-430b-b4c5-5ba6cec1f82b','319028f2-fd01-11f0-a8c3-d6c7b7971942','ORD-1769686776288239','pending',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR','cod','pending','{\"city\": \"Al Haram\", \"email\": \"helmymo1994@gmail.com\", \"phone\": \"01080105104\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐ ΓÇö Cairo Governorate\", \"address\": \"Hadayek Al Ahram, Kafr Nassar\", \"country\": \"Saudi Arabia\", \"zipCode\": \"3387722\", \"lastName\": \" mo\", \"firstName\": \"helmy\"}','helmy  mo','01080105104','Al Haram','3387722',NULL,NULL,NULL,'2026-01-29 11:39:36','2026-01-29 11:39:36',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('7619568e-f26f-44b2-81a2-bcd82eedb86b','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768763494442644','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 19:11:34','2026-01-18 19:11:34',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('7837dc0e-c03e-4b57-822a-92694353954c','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768763476305133','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 19:11:16','2026-01-18 19:11:16',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('7e92d4a6-c409-45d0-837b-e3182044f5bb','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769174545672361','pending',NULL,'pending',33.00,0.00,0.00,0.00,33.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-23 13:22:25','2026-01-23 13:22:25',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('81e3d56e-f847-4673-a545-0cc08022b125','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769518673491231','pending',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 12:57:53','2026-01-27 12:57:53',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('84bd5658-4228-4429-bf45-3936bf13e7ba','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-176876017346742','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 18:16:13','2026-01-18 18:16:13',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('8d286e59-ff02-4eab-b6d9-b8362b16d2be','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768766013270598','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 19:53:33','2026-01-18 19:53:33',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('8d659eb3-8c2a-4865-aeaf-2d8de992172d','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769174769567324','pending',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-23 13:26:09','2026-01-23 13:26:09',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('8f2172c2-7072-409e-854c-4632e098a176','0e5fea0e-f5da-11f0-ac31-fee8668bd513','ORD-1768901067328151','pending',NULL,'pending',89.97,0.00,0.00,0.00,89.97,'SAR',NULL,'pending','{\"city\": \"cairo\", \"email\": \"\", \"phone\": \"+201121106662\", \"state\": \"jeddah\", \"address\": \"cairo , 1\", \"country\": \"Saudi Arabia\", \"zipCode\": \"11111\", \"lastName\": \"\", \"firstName\": \"\"}',' ','+201121106662','cairo','11111',NULL,NULL,NULL,'2026-01-20 09:24:27','2026-01-20 09:24:27',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('918a07be-7e3a-467b-a9dc-9388a737a587','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768762338409707','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 18:52:18','2026-01-18 18:52:18',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('982f4269-1b9d-4fd2-b8cd-8c64d5163d45','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768758345558736','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"\", \"firstName\": \"\"}',' ','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 17:45:45','2026-01-18 17:45:45',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('a0d012ab-c474-4f5a-aef7-9f53c3f43d89','d9bc539e-fa1a-11f0-80c2-ae9b26e7caa3','ORD-1769365370825417','delivered',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Riyadh\", \"email\": \"crash_test_1769365356370@example.com\", \"phone\": \"0555555555\", \"address\": \"123 Test St\", \"country\": \"SA\", \"zipCode\": \"12345\", \"lastName\": \"Test\", \"firstName\": \"Crash\"}','Crash Test','0555555555','Riyadh','12345',NULL,NULL,NULL,'2026-01-25 18:22:51','2026-01-26 11:49:13',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('a0e79b5d-91cd-405e-a56e-252c75d5c48e','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768758259561401','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"\", \"firstName\": \"\"}',' ','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 17:44:19','2026-01-18 17:44:19',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('a87cb0ec-cbea-4cfa-b2e2-465f6a30d6f8','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769422236979205','delivered',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-26 10:10:37','2026-01-26 11:50:38',0.00,0.00,NULL,'[{\"items\": [\"42a4614e-fa9f-11f0-a484-e6bd1e06c4ba\"], \"phone\": \"324234234\", \"reason\": \"sdfsdf\", \"status\": \"approved\", \"address\": \"gfdgd g,dter\", \"createdAt\": \"2026-01-26T11:50:05.434Z\", \"requestId\": \"8734a409-3fc1-47c8-9272-231d10efd1d4\", \"pickupTime\": \"2026-01-26T13:49\"}]',0,NULL,0,NULL,NULL,NULL,NULL),('ae2384e6-d4f4-40a0-a51f-cb0655ecba8b','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768763462245319','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 19:11:02','2026-01-18 19:11:02',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('b8dbe968-ca47-41ff-946a-71fa7e117528','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768762918550251','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 19:01:58','2026-01-18 19:01:58',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('b90654ae-5824-4133-8bb1-9337fc359493','0e5fea0e-f5da-11f0-ac31-fee8668bd513','ORD-1768902665170530','pending',NULL,'pending',89.97,0.00,0.00,0.00,89.97,'SAR',NULL,'pending','{\"city\": \"cairo\", \"email\": \"\", \"phone\": \"+201121106662\", \"state\": \"jeddah\", \"address\": \"cairo , 1\", \"country\": \"Saudi Arabia\", \"zipCode\": \"11111\", \"lastName\": \"\", \"firstName\": \"\"}',' ','+201121106662','cairo','11111',NULL,NULL,NULL,'2026-01-20 09:51:05','2026-01-20 09:51:05',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('bfc20d02-c4e6-4691-824c-f3bf84d06b19','0e5fea0e-f5da-11f0-ac31-fee8668bd513','ORD-1768899247696385','pending',NULL,'pending',59.98,0.00,0.00,0.00,59.98,'SAR',NULL,'pending','{\"city\": \"cairo\", \"email\": \"helmymhelmy22@gmail.com\", \"phone\": \"+201121106662\", \"state\": \"jeddah\", \"address\": \"cairo , 1\", \"country\": \"Saudi Arabia\", \"zipCode\": \"11111\", \"lastName\": \"mohammed\", \"firstName\": \"helmy\"}','helmy mohammed','+201121106662','cairo','11111',NULL,NULL,NULL,'2026-01-20 08:54:07','2026-01-20 08:54:07',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('c06719bb-a975-438f-99b7-3d493ee818f3','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769514859985955','pending',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 11:54:19','2026-01-27 11:54:19',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('c1a27f28-ede3-4c1e-8e5d-b4866a8b7760','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768760160578355','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 18:16:00','2026-01-18 18:16:00',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('c201b8cd-6a8f-4ffb-aec2-72d23dc8a86c','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769174782403465','pending',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-23 13:26:22','2026-01-23 13:26:22',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('cc5cba01-a950-4b83-9e8e-b219267815d1','0e5fea0e-f5da-11f0-ac31-fee8668bd513','ORD-1768903552002659','pending',NULL,'pending',89.97,0.00,0.00,0.00,89.97,'SAR',NULL,'pending','{\"city\": \"cairo\", \"email\": \"\", \"phone\": \"+201121106662\", \"state\": \"jeddah\", \"address\": \"cairo , 1\", \"country\": \"Saudi Arabia\", \"zipCode\": \"11111\", \"lastName\": \"\", \"firstName\": \"\"}',' ','+201121106662','cairo','11111',NULL,NULL,NULL,'2026-01-20 10:05:52','2026-01-20 10:05:52',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('d6e5ef30-d815-4094-8cc3-49aa3fd65d43','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-176951964270459','pending',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 13:14:02','2026-01-27 13:14:02',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('d796004c-2f01-4b30-9958-99219fb65742','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769522426023245','confirmed',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR','cod','pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 14:00:26','2026-01-29 11:20:53',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('dd8bd2ea-c18a-497a-aeb7-85a01fed9840','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1769332277327100','cancelled',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-25 09:11:17','2026-01-25 19:18:59',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('e179d3a4-6199-42dc-a1e6-42067110313e','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769429575301327','delivered',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-26 12:12:55','2026-01-27 09:20:15',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('e2e0d366-70c6-47c6-aebe-b6c9246ddfd9','98a352b8-fa1a-11f0-80c2-ae9b26e7caa3','ORD-176936526540838','pending',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Riyadh\", \"email\": \"crash_test_1769365245124@example.com\", \"phone\": \"0555555555\", \"address\": \"123 Test St\", \"country\": \"SA\", \"zipCode\": \"12345\", \"lastName\": \"Test\", \"firstName\": \"Crash\"}','Crash Test','0555555555','Riyadh','12345',NULL,NULL,NULL,'2026-01-25 18:21:05','2026-01-25 18:21:05',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('e312c7c1-fcce-4dc7-800c-d0aadcbcba6a','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768758676719921','pending',NULL,'pending',529.97,0.00,0.00,0.00,529.97,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"\", \"firstName\": \"\"}',' ','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 17:51:16','2026-01-18 17:51:16',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('e3740e12-2727-4ff2-b8ce-795c187b994c','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768757294283607','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 17:28:14','2026-01-18 17:28:14',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('e3ceac9a-0794-4a7c-8442-6adcbc1684b1','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768762413414679','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 18:53:33','2026-01-18 18:53:33',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('e67f8563-f19b-4d8b-b6a2-1fbd09c80355','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768763692048295','delivered',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 19:14:52','2026-01-24 12:08:50',0.00,0.00,NULL,'[{\"items\": [\"6ea10fff-41a3-4386-9004-d4b80de6b8e4\"], \"phone\": \"ttt\", \"reason\": \"tt\", \"status\": \"approved\", \"address\": \"32 Al Falki\", \"createdAt\": \"2026-01-24T12:08:36.917Z\", \"requestId\": \"bcd1dfa0-e93f-4d5b-9a2a-0dfdc0438df1\", \"pickupTime\": \"2026-01-24T14:08\"}]',0,NULL,0,NULL,NULL,NULL,NULL),('e8eff5b8-fa94-4c1b-a28b-270813363ec9','0e5fea0e-f5da-11f0-ac31-fee8668bd513','ORD-176890069205566','pending',NULL,'pending',89.97,0.00,0.00,0.00,89.97,'SAR',NULL,'pending','{\"city\": \"cairo\", \"email\": \"\", \"phone\": \"+201121106662\", \"state\": \"jeddah\", \"address\": \"cairo , 1\", \"country\": \"Saudi Arabia\", \"zipCode\": \"11111\", \"lastName\": \"\", \"firstName\": \"\"}',' ','+201121106662','cairo','11111',NULL,NULL,NULL,'2026-01-20 09:18:12','2026-01-20 09:18:12',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('eb6f615c-3aa5-4c94-b79f-d74a6a6efd0a','0e5fea0e-f5da-11f0-ac31-fee8668bd513','ORD-1768897808941858','pending',NULL,'pending',59.98,0.00,0.00,0.00,59.98,'SAR',NULL,'pending','{\"city\": \"cairo\", \"email\": \"helmymhelmy22@gmal.com\", \"phone\": \"+201121106662\", \"state\": \"jeddah\", \"address\": \"cairo , 1\", \"country\": \"Saudi Arabia\", \"zipCode\": \"11111\", \"lastName\": \"mo\", \"firstName\": \"helmy\"}','helmy mo','+201121106662','cairo','11111',NULL,NULL,NULL,'2026-01-20 08:30:08','2026-01-20 08:30:08',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('f11bf050-ceb0-425a-b494-ea0a00354624','8bbf3ff8-f553-11f0-b4a3-0e755bccd232','ORD-1769514922806807','pending',NULL,'pending',120.00,0.00,0.00,0.00,120.00,'SAR',NULL,'pending','{\"city\": \"WSF\", \"email\": \"helmym8hamed6662@gmail.com\", \"phone\": \"323333343443\", \"state\": \"SSE\", \"address\": \"FGDD ,GFR\", \"country\": \"Saudi Arabia\", \"zipCode\": \"WSSD\", \"lastName\": \"Mohamed\", \"firstName\": \"Helmy\"}','Helmy Mohamed','323333343443','WSF','WSSD',NULL,NULL,NULL,'2026-01-27 11:55:22','2026-01-27 11:55:22',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('f15f4f38-65a1-43ae-9803-fef7d64e38eb','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768762940665226','pending',NULL,'pending',29.99,0.00,0.00,0.00,29.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 19:02:20','2026-01-18 19:02:20',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('f274eb57-c6b3-4238-8c7c-994e5fbbe3c7','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768741375000466','pending',NULL,'pending',199.99,0.00,0.00,0.00,199.99,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"fatmamokhtar859@gmail.com\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"Tech\", \"firstName\": \"Meta\"}','Meta Tech','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 13:02:55','2026-01-18 13:02:55',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('f2d46112-8cd0-4be9-891f-886bc1652a70','99e3a4b4-f464-11f0-9ec6-bafe02a6c085','ORD-1768758496232282','pending',NULL,'pending',399.98,0.00,0.00,0.00,399.98,'SAR',NULL,'pending','{\"city\": \"Abdeen\", \"email\": \"\", \"phone\": \"555555555555\", \"state\": \"╪º┘ä┘é╪º┘ç╪▒╪⌐\", \"address\": \"32 Al Falki\", \"country\": \"Saudi Arabia\", \"zipCode\": \"4280102\", \"lastName\": \"\", \"firstName\": \"\"}',' ','555555555555','Abdeen','4280102',NULL,NULL,NULL,'2026-01-18 17:48:16','2026-01-18 17:48:16',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL),('f3004173-4396-4288-9751-ba3ab4ef4594','64dd00bb-fa19-11f0-80c2-ae9b26e7caa3','ORD-1769364744053142','delivered',NULL,'pending',11.00,0.00,0.00,0.00,11.00,'SAR',NULL,'pending','{\"city\": \"Riyadh\", \"email\": \"testuser_1769364740546@example.com\", \"phone\": \"0555555555\", \"address\": \"123 Test St\", \"country\": \"Saudi Arabia\", \"zipCode\": \"12345\", \"lastName\": \"User\", \"firstName\": \"Test\"}','Test User','0555555555','Riyadh','12345',NULL,NULL,NULL,'2026-01-25 18:12:24','2026-01-27 08:54:16',0.00,0.00,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `image_url` text NOT NULL,
  `alt_text_en` varchar(255) DEFAULT NULL,
  `alt_text_ar` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES ('0175a3a1-ea1c-444f-b1c4-ca6c0bbe445e','31fb8967-5828-46d9-a6d1-db9a2c444602','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301347-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('020bd29c-5ae3-47d1-b2f6-afd9752ade12','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0858-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('02a3287d-a24e-486d-9c33-8f9c307f14e6','42418a8b-4cfe-4b10-989f-042a67ea87d1','https://raziastore.com/wp-content/uploads/2025/12/DSC_0989.jpg',NULL,NULL,0,1,'2026-01-29 12:29:50'),('039036fc-f5df-4c4a-af72-6ea8c6fa0b59','c04fe474-67ae-47c6-999d-3d0681360a71','https://raziastore.com/wp-content/uploads/2025/11/DSC_0866.jpg',NULL,NULL,0,1,'2026-01-29 12:29:50'),('049c5e44-d3b3-439e-859a-3a4b43e12353','876db775-cb61-45c4-8c3f-06bbea2ecada','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02393-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('05ec9ca9-24d5-4285-a7ef-f421c747acc5','5dd8f623-41d8-4fb5-a2a8-b504b18b293f','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02294-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:41'),('06eff129-5655-4015-bf8d-5a61ef23fdfd','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','https://raziastore.com/wp-content/uploads/2025/11/DSC_0975-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('08d7c089-1c54-403d-86d6-f62c81c88207','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','https://raziastore.com/wp-content/uploads/2025/11/DSC_0959.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('09a88d49-3c09-4a8d-a187-c020fe598b8e','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','https://raziastore.com/wp-content/uploads/2025/11/DSC_0892.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('0a5fc70e-e625-4c45-898a-d80fa6ea5abd','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0814.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('0d6aa573-1e9d-406a-a4cc-6a65ef27c54b','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/DSC_0982.jpg',NULL,NULL,0,0,'2026-01-29 12:29:50'),('0ea0ef72-2951-424e-8678-46a4f88cd034','7cd7317e-1c0f-4d0e-ace3-55a5f3b28283','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301354.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('0ee99cd8-08ae-4fdb-9e7d-751eae01c7e3','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-22-at-1.21.14-AM.jpeg',NULL,NULL,0,0,'2026-01-29 12:29:50'),('11144f6a-8403-42a7-b26a-90d061a838cf','31fb8967-5828-46d9-a6d1-db9a2c444602','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02335-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:42'),('11c59f81-5601-4cc7-bab1-783594ec4dd2','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','https://raziastore.com/wp-content/uploads/2025/11/DSC_0887.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('127e4ff6-c171-453e-96cc-0f8b29725f78','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','https://raziastore.com/wp-content/uploads/2025/11/DSC_0979.jpg',NULL,NULL,0,1,'2026-01-29 12:29:48'),('1393c0ce-7906-44a9-adad-85944a2657e1','41798058-5ef8-4c8e-bc08-9c9061d53626','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301082-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:44'),('1431ce6b-9010-40fa-9bdb-9bb3d81b40d0','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/57ccbf84-9460-4cdd-87d1-6162deb93e8d.png',NULL,NULL,0,0,'2026-01-29 12:29:49'),('152141b7-c49c-4cff-9336-df4bd5efbc5f','3328357b-a763-4324-a47b-5a35171b5792','https://raziastore.com/wp-content/uploads/2025/11/DSC_0834.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('1587001c-6fd1-4d42-a533-1c681eef7583','5dd8f623-41d8-4fb5-a2a8-b504b18b293f','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301066-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:41'),('15fba219-9788-4181-8ca1-6d9a721be60a','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0857-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('1a29f9d3-7e5a-4918-a5fe-22705c85ba45','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/DSC_0989.jpg',NULL,NULL,0,1,'2026-01-29 12:29:49'),('1a7caa05-4288-45e5-bcb3-a7f2521430cd','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0935.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('1bdc9570-4aec-420e-aca2-edaa0eb022bf','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0776.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('1e0545ca-fcc2-494f-a45a-857d36605269','1797868b-8d02-415f-b87e-685fbd412597','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301154-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:41'),('1f60f48e-be22-4631-8d36-e39971b4b2ea','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0766.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('214ba185-5771-4753-94f5-73acf1a39721','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','https://raziastore.com/wp-content/uploads/2025/11/DSC_0960-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('217399c5-abaf-429c-9bad-2c6d4c1a7a25','0ec595e9-ccd7-400a-b7c8-c687237232ed','https://raziastore.com/wp-content/uploads/2025/11/DSC_0951.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('22e4a889-22ec-4f5f-af98-3ae2253e79c3','8803db5c-d5f0-4d2a-bc31-ef8922f9b09f','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301247-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('267e0531-f4d3-4920-8a98-82c59fec4977','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/11/DSC_1007.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('26b6bba0-9f53-4d2c-9126-5a896ea39b9b','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0954.jpg',NULL,NULL,0,1,'2026-01-29 12:29:47'),('271572a9-c5c7-4a67-b041-8b844bf28061','80a0cf58-4178-4f41-b5c4-bb22d71a67ba','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02351-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:44'),('2935f7b5-630a-44e8-b445-09ec8391e80c','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1071-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('2a51aaf6-2258-424c-bae6-7f872756df56','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0986.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('2b2272c3-414b-4eb0-878b-7ec9dd4074c5','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0862.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('2b353ee4-96d8-4399-9dfa-1d5b4bce933f','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0865.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('2cf319b8-50ee-4ff0-bf3b-1ea69e7c4ead','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','https://raziastore.com/wp-content/uploads/2025/11/DSC_0912.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('2d8fc562-d3c6-498c-8ba4-1d43d4a3735e','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0867.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('31734eb1-3973-4bf0-b3d5-c57fcd744bff','7cd7317e-1c0f-4d0e-ace3-55a5f3b28283','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301430-1-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('32e816ba-1b31-46ee-a175-7b555bb54e2c','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/11/DSC_1004.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('3539c996-fcab-4b61-8a82-d1117d717e54','7cd7317e-1c0f-4d0e-ace3-55a5f3b28283','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02351-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:43'),('3590a77e-a640-4cbe-b791-c8e3d424a88d','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1036.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('35bd3378-664b-4a0a-bde2-aa833d5b6cec','58148fae-fd7a-4610-b13a-9fab21dfa6c5','https://raziastore.com/wp-content/uploads/2025/11/DSC_1027.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('36a9f084-f955-4d02-8525-ded834136f5a','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0813.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('36cc0548-c891-4139-b769-d0b2106e7698','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0771.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('386455be-c216-4370-afa5-d758000e0cc3','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-22-at-1.16.01-AM.jpeg',NULL,NULL,0,0,'2026-01-29 12:29:50'),('3892f9bc-22ba-4194-8fdc-5e2268e85b7a','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301457-2-scaled-e1741064070846.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('38a8b3c3-389b-4abc-87ef-4ef8dddf021f','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0975.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('398be2d6-dc6f-4370-9416-4a929ec0384d','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0997.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('3a3482e7-522c-4291-9d8c-cb28fc07774e','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','https://raziastore.com/wp-content/uploads/2025/11/DSC_0890.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('3db17ad6-da17-42a7-9d3f-ea17c9dd1815','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0967.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('3dc42505-594b-47c1-b22b-c9f3d185cef4','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0957.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('3f46e8e6-b4ff-46f6-be1f-7740efb2a9d4','80a0cf58-4178-4f41-b5c4-bb22d71a67ba','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02323-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('3fe45973-d12e-4cf4-b658-3a151a2d5aaf','100ce1fa-7565-452b-81c4-ac79ba7616ec','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301273-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('401e74e5-6efa-45b6-9a7b-62a7a65645d3','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02323-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('416aa6c8-ff7c-49b8-8891-677b032fb340','31fb8967-5828-46d9-a6d1-db9a2c444602','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301339-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('44fb00e1-41bd-46b1-b887-8318ae5ffe80','8803db5c-d5f0-4d2a-bc31-ef8922f9b09f','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301237-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:43'),('4596eba4-cdd5-4331-81df-ebf1341f2980','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1067.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('46983826-58a4-40a8-ae96-caba30d7d635','80a0cf58-4178-4f41-b5c4-bb22d71a67ba','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301457-2-scaled-e1741064070846.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('46df612e-60c8-46f0-8873-a83b74ee1a2e','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-22-at-1.16.01-AM.jpeg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('48289285-a58a-4f41-84e9-9e8efd892a8b','0e5b2d04-41d2-4543-9b33-148a5493ac3c','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02401-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('486ad9d8-f6a9-4bfe-8671-067bdc04ea20','8bfb3ff1-bc8d-4cb6-b213-659acd9a3cc6','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301556-2-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:50'),('4b55dcb9-b0d3-45da-8832-0516d85219a7','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0782.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('4c42e6f3-badb-427b-a621-737bb3799a62','5dd8f623-41d8-4fb5-a2a8-b504b18b293f','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301088-1-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:41'),('50d9ea63-3a26-48d5-b6cf-aa7cd1fa7237','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/a4c0dd4d-a5d6-496b-8119-da5ed67395d7.png',NULL,NULL,0,0,'2026-01-29 12:29:50'),('52f79734-7936-46c2-936c-9334b49ae2c8','708f6942-c9d2-4904-b0c3-8abdf3d05bd6','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02383-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('54709a81-7bbd-4799-be61-db0fb7cde06a','876db775-cb61-45c4-8c3f-06bbea2ecada','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02389-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:43'),('565c3481-eecb-44bc-a498-2d154304b986','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/11/DSC_1010.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('571e5450-da57-455d-be48-a91cfbe7e46b','0ec595e9-ccd7-400a-b7c8-c687237232ed','https://raziastore.com/wp-content/uploads/2025/11/DSC_0941.jpg',NULL,NULL,0,1,'2026-01-29 12:29:49'),('58a5875a-ba56-4f8e-8448-abf4011a456b','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0866.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('598d9cfc-4ebb-4eb3-af0b-4e7f08011b31','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0857.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('5a102de9-f005-4b2b-af42-4bd75cfaf14f','31fb8967-5828-46d9-a6d1-db9a2c444602','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02375-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('5c36b3af-1c4b-402b-9c02-09d22fe5f742','1797868b-8d02-415f-b87e-685fbd412597','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301159-1-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:41'),('5d13fee3-6fb8-4af6-af42-f652aaf2df86','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0762.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('5d80afd9-2e30-489f-94d3-e496e040effc','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1083.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('60934b21-3b02-4293-b101-93fe1317a3e7','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/DSC_0997.jpg',NULL,NULL,0,0,'2026-01-29 12:29:50'),('60df8cfb-67b7-4dd7-a7c0-ee220d480231','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','https://raziastore.com/wp-content/uploads/2025/11/DSC_0981-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('61e8e3f9-65e4-4ba5-bb9a-d8e39e85a536','3328357b-a763-4324-a47b-5a35171b5792','https://raziastore.com/wp-content/uploads/2025/11/DSC_0843.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('645459e9-e252-422b-a0e6-a80de143bf64','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0819.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('6655c850-da95-435e-a547-eda494204c14','3328357b-a763-4324-a47b-5a35171b5792','https://raziastore.com/wp-content/uploads/2025/11/DSC_0840.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('66a5fc6f-39f4-48fd-997d-d8366f9dbc44','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1081.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('67706eef-47b3-4a1c-96ab-4090e1aa9972','c25ef4fe-ee02-4301-9017-952031d9eef6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0797.jpg',NULL,NULL,0,1,'2026-01-29 12:29:47'),('69aceabc-2077-4eec-a6ce-cdc9cafee920','2f2df491-71e4-4e48-8069-484e125f37cf','https://raziastore.com/wp-content/uploads/2025/11/DSC_0913.jpg',NULL,NULL,0,1,'2026-01-29 12:29:53'),('69ef0cf8-1f80-4903-9201-c57f8abde9e1','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1035.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('6aab42bd-0b8f-4b2f-b8af-411398e300ad','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0864.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('6ac4de9f-1ee7-4c18-a2ca-ad18dac0ed4d','1797868b-8d02-415f-b87e-685fbd412597','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301143-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('6b5ac0e1-2a2d-40ec-8fba-fd9de538fdf1','3328357b-a763-4324-a47b-5a35171b5792','https://raziastore.com/wp-content/uploads/2025/11/DSC_0838.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('6f611c9b-c802-4d95-a92b-cc5081b40abe','b45c2710-2fa4-4d91-b736-2fe35a9c5974','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301556-2-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:43'),('7054b048-47b1-44a1-b7fd-022b51f33e98','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/11/DSC_1004.jpg',NULL,NULL,0,0,'2026-01-29 12:29:50'),('724eddd0-35eb-4a4c-8359-f2d4b8c85924','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/DSC_0986.jpg',NULL,NULL,0,0,'2026-01-29 12:29:50'),('735a64ca-af85-4a37-bef5-bb6eb1f2b158','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0969.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('73a8779e-4e03-4994-8166-79d2255a8a63','0e5b2d04-41d2-4543-9b33-148a5493ac3c','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02405-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('73c577ae-1ce7-44f8-ac49-e6b6d48ad6b7','876db775-cb61-45c4-8c3f-06bbea2ecada','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301506-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('75836c61-105e-4dd6-84fc-3fec11b00c26','d38cdac8-5c58-4d03-99da-d949fe9c7986','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02277-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:49'),('7dd701c8-c465-4e29-99df-baf5cbf72438','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0956.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('803b8915-87c5-4618-b8b6-cdeb95d40e3d','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/DSC_0789.jpg',NULL,NULL,0,0,'2026-01-29 12:29:50'),('813bbbe8-235a-4692-85e4-3feba5d8c2d0','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','https://raziastore.com/wp-content/uploads/2025/11/DSC_0976.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('83f3a7bd-0129-4fa6-b8ad-d690284c2fc9','58148fae-fd7a-4610-b13a-9fab21dfa6c5','https://raziastore.com/wp-content/uploads/2025/11/DSC_1030.jpg',NULL,NULL,0,1,'2026-01-29 12:29:47'),('86455193-d549-4181-ac41-caee8c518218','3328357b-a763-4324-a47b-5a35171b5792','https://raziastore.com/wp-content/uploads/2025/11/DSC_0841.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('874f0555-f17d-4f1b-bc35-8ba6b8f542f5','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0765.jpg',NULL,NULL,0,1,'2026-01-29 12:29:45'),('8f985f2c-f5ff-4c33-bd55-aecf92ba4c22','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1069.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('92f47122-f8d0-492a-8355-e88d7f4be06b','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/DSC_0994.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('953e9e25-2eec-4404-a493-be56e20c3c91','c25ef4fe-ee02-4301-9017-952031d9eef6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0918.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('9585d145-5d04-440f-8f39-0430ca1942d6','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301449-2-scaled-e1742596960349.jpg',NULL,NULL,0,1,'2026-01-29 12:29:43'),('96c979b2-8f2f-42ed-92be-f720e420b5cb','2b8aff25-5972-44ac-a36a-60e0cb03a84f','https://raziastore.com/wp-content/uploads/2025/08/razia-1-scaled-1.jpeg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('9868a2e5-8b6d-4946-8aec-451311b28bd5','85310419-aa0e-487f-8739-c87696aad927','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301085-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:41'),('992a3f52-3ffc-4e57-bb26-e74cc0d1b56c','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/11/DSC_1028.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('9b1fd4a0-d1f0-41cb-96c1-9e8d9403791e','0d0ce9f9-9f7d-43fe-bd95-dc95a3ef93ea','https://raziastore.com/wp-content/uploads/2025/11/DSC_1013.jpg',NULL,NULL,0,1,'2026-01-29 12:29:51'),('9b52ced2-be9d-48b9-9541-166b9e6965cc','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/dress.jpeg',NULL,NULL,0,1,'2026-01-29 12:29:44'),('9bf215b9-c52b-49dc-abbf-905b36876a44','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','https://raziastore.com/wp-content/uploads/2025/11/DSC_0894.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('9e56f549-3cc2-40c5-91c2-d663b2312a2e','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','https://raziastore.com/wp-content/uploads/2025/11/DSC_0888.jpg',NULL,NULL,0,1,'2026-01-29 12:29:49'),('a09aa2d5-3a05-4993-a6b0-0795d258d9f1','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_1001.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('a225e660-2439-4e77-b9bf-217ec228f016','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/11/DSC_0847.jpg',NULL,NULL,0,0,'2026-01-29 12:29:50'),('a27da628-de32-4cf6-8e52-c2b9844675a8','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1059.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('a28e172d-829f-4a2c-b6d8-c45240eaa5a0','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0960.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('a2cc65cb-febd-4e1a-86fb-93ccbda3ca52','d775319d-8167-40a8-9a87-670631653255','https://raziastore.com/wp-content/uploads/2025/11/DSC_0970.jpg',NULL,NULL,0,1,'2026-01-29 12:29:50'),('a305b046-de17-42c4-b9b8-56539c4fe536','100ce1fa-7565-452b-81c4-ac79ba7616ec','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301261-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('a443f267-aa3a-4ceb-8e63-8fdfda8c676e','31fb8967-5828-46d9-a6d1-db9a2c444602','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301447-scaled.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('a4a51185-62b4-4e56-84d7-83bcecc075e7','a693465d-6bff-4e93-b620-62e06123e64a','https://raziastore.com/wp-content/uploads/2025/08/20250225_222050_0000.png',NULL,NULL,0,1,'2026-01-29 12:29:41'),('a5af48df-a708-4632-b46d-5f50f58c16e7','dc7ae370-c7ca-4c17-b88b-98305b67511b','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02369-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:42'),('a645b632-5d4b-4d88-be2c-c51e6549a351','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','https://raziastore.com/wp-content/uploads/2025/11/DSC_0918-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('a700f73c-0253-4015-8e1b-7e0ff477281f','76a804e3-3083-40f4-a5cb-d4492e2cbea0','https://raziastore.com/wp-content/uploads/2025/11/DSC_0847.jpg',NULL,NULL,0,1,'2026-01-29 12:29:51'),('aa17e465-4ff5-4884-a251-0bdd7569c9dc','0ec595e9-ccd7-400a-b7c8-c687237232ed','https://raziastore.com/wp-content/uploads/2025/11/DSC_0950.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('aae9f51c-0153-4c0f-aead-4ce5a2484b91','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1082.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('ab119918-639f-411a-a7af-287d29394e92','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/11/DSC_1008.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('ad791b35-9cdf-4427-9681-73913336449a','dc7ae370-c7ca-4c17-b88b-98305b67511b','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301354-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('adfdba90-1b54-4ce7-9415-cb03ceb89a60','85310419-aa0e-487f-8739-c87696aad927','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301082-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:41'),('aea547b1-4797-499b-9352-1971fa90ac5d','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/11/DSC_1014.jpg',NULL,NULL,0,1,'2026-01-29 12:29:48'),('af3c2330-8110-4458-92fc-e8791a904370','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0927.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('afd8d1e4-a0aa-43a1-b3be-0db192d2d936','1797868b-8d02-415f-b87e-685fbd412597','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301171-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('b08b99f5-1b76-48a3-afa5-79486d6a262b','58148fae-fd7a-4610-b13a-9fab21dfa6c5','https://raziastore.com/wp-content/uploads/2025/11/DSC_1026.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('b14a32a2-28bc-40fe-9f94-3f4653a281db','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','https://raziastore.com/wp-content/uploads/2025/11/DSC_0965.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('b3218b03-767b-49ee-86be-c9f3f5ab1488','31fb8967-5828-46d9-a6d1-db9a2c444602','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301345-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('b363b015-1662-432c-9d38-26b495b0101f','2b8aff25-5972-44ac-a36a-60e0cb03a84f','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301550-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:42'),('b447c9f2-d4f2-40fc-885e-b364a9e40111','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0970.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('b4ef795b-deea-43a6-b4ad-26485c68cd39','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1033.jpg',NULL,NULL,0,0,'2026-01-29 12:29:44'),('b5143099-f347-4fcc-be87-819b1bba1013','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1061.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('b556dae8-2717-452f-bbab-c748cee1d098','a693465d-6bff-4e93-b620-62e06123e64a','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02277-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:41'),('b563ba31-b8e5-4f1c-acdc-ee4d3d99214d','708f6942-c9d2-4904-b0c3-8abdf3d05bd6','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301529-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('b9381cd0-0849-413c-9d7b-352d48261ce1','b45c2710-2fa4-4d91-b736-2fe35a9c5974','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301579-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('b96ff6e5-dd2c-42f5-8c94-8554281b116a','c25ef4fe-ee02-4301-9017-952031d9eef6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0795.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('b9cb7ad2-0fe6-4388-96e2-bc176cd8fcc1','85310419-aa0e-487f-8739-c87696aad927','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301102-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:41'),('be09224c-11ee-4346-a416-d82722084c17','3328357b-a763-4324-a47b-5a35171b5792','https://raziastore.com/wp-content/uploads/2025/11/DSC_0847.jpg',NULL,NULL,0,1,'2026-01-29 12:29:47'),('c3cecbe1-fea1-4e28-a3b2-318125ac8631','c25ef4fe-ee02-4301-9017-952031d9eef6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0818.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('c4138704-1331-48e0-b372-6c6ff2d59760','0be06292-8716-4860-bd73-6c54a37c68be','https://raziastore.com/wp-content/uploads/2025/11/DSC_1073.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('c43bef64-a0ac-4341-b8a9-ec60e447eb9e','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0958.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('c452f006-c77e-43e9-afe7-d334d3abd8ba','100ce1fa-7565-452b-81c4-ac79ba7616ec','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301270-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:42'),('c587c00b-baf1-41b1-85e0-7452a3520d2e','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-22-at-1.21.14-AM.jpeg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('c597a8f3-cbfc-4488-baae-e0acf36550a1','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0757.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('c8895b4a-eb4a-49b2-a598-9fce719dd6fd','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0952.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('c9a58251-22a5-47f2-b128-d46520f0159c','d5527268-4c93-4a01-9fd2-bde3a7781178','https://raziastore.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-22-at-1.16.01-AM.jpeg',NULL,NULL,0,1,'2026-01-29 12:29:54'),('ca7ae370-802a-4d4f-a220-228e268a5276','708f6942-c9d2-4904-b0c3-8abdf3d05bd6','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301498-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:43'),('cc6b7097-295d-477c-b089-ff987899a713','876db775-cb61-45c4-8c3f-06bbea2ecada','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301504.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('cd1032e5-0a34-42c4-aec4-e9adf15f6d0d','85310419-aa0e-487f-8739-c87696aad927','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02290-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:41'),('cf60a2fa-04ce-4d19-9d6e-e348e7d7d49c','3328357b-a763-4324-a47b-5a35171b5792','https://raziastore.com/wp-content/uploads/2025/11/DSC_0851.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('d2411306-c8b5-45a8-9531-6345eadd2aab','0e5b2d04-41d2-4543-9b33-148a5493ac3c','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301198-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:42'),('d43a13cf-b88e-431b-83cf-14d929f372a3','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','https://raziastore.com/wp-content/uploads/2025/11/DSC_0913.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('d53e9ac2-75dd-44bc-93ce-1f328de326f4','100ce1fa-7565-452b-81c4-ac79ba7616ec','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301277-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('d76f47a6-ad98-4bdb-9803-734af0d2d5ab','c25ef4fe-ee02-4301-9017-952031d9eef6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0924.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('d97f16ff-9dc6-4886-b29e-19f1215849a1','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/DSC_0996.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('db26fa94-7983-4610-8d9f-04666f6165d5','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/12/41548bc2-d803-46cc-89f4-b3e9531ea77d-scaled.png',NULL,NULL,0,0,'2026-01-29 12:29:50'),('db70f988-226a-46d7-a1bd-f3141204a7b5','0e5b2d04-41d2-4543-9b33-148a5493ac3c','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301196-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('dd177868-f1ff-4cb0-8be2-c3b6ac7d186d','d510b0da-a019-4341-b8fb-3ea68c99d2aa','https://raziastore.com/wp-content/uploads/2025/11/DSC_1005.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('de6039bb-5d91-45d7-bcf3-fb3190910438','176edfbc-d821-414e-8e3a-004525853657','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02383-scaled-1.jpg',NULL,NULL,0,1,'2026-01-29 12:29:50'),('e0456ae1-dd32-4693-ab2a-0b24acbf447b','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0759.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('e163f204-5c27-4eb4-9d3f-70a0ab668e68','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0863.jpg',NULL,NULL,0,1,'2026-01-29 12:29:45'),('e18b5b87-861a-4811-9576-76d4c7cbffb3','0ec595e9-ccd7-400a-b7c8-c687237232ed','https://raziastore.com/wp-content/uploads/2025/11/DSC_0943.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('e1aa7050-ef26-470f-9547-4afdb188fb96','0e5b2d04-41d2-4543-9b33-148a5493ac3c','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02409-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('e456fd04-b94e-4ee3-b95f-a1e6f9a744e4','2b8aff25-5972-44ac-a36a-60e0cb03a84f','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301544-2-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('e4819251-504a-46d8-b562-2dc83aa95c81','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0858.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('e4cba4a5-509b-490d-a044-e370a118d805','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0812-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('e63d7968-e6cd-4d9c-ad8c-ad37f4e1570e','7cd7317e-1c0f-4d0e-ace3-55a5f3b28283','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301435-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('e670078b-1d94-40d1-815b-bea656447212','1797868b-8d02-415f-b87e-685fbd412597','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02275-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('e71cad9f-cad4-4011-a677-cc22f55f1e77','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/11/DSC_1009.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('e8e935c4-31d9-463d-a234-155af8784a14','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','https://raziastore.com/wp-content/uploads/2025/11/DSC_0961.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('e90bfadc-291f-4252-a88a-ad175359c262','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0859-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:46'),('eae1bb38-6158-4eef-99b6-f33ef3751a68','8b5a1822-1be3-4163-8480-01b5acdf765f','https://raziastore.com/wp-content/uploads/2025/11/DSC_1013.jpg',NULL,NULL,0,0,'2026-01-29 12:29:48'),('ece97a96-9557-4535-bafc-b3c08679f0b8','b45c2710-2fa4-4d91-b736-2fe35a9c5974','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301596-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:43'),('ed12f9ec-1228-4210-8ee1-95ce53700568','0ec595e9-ccd7-400a-b7c8-c687237232ed','https://raziastore.com/wp-content/uploads/2025/11/DSC_0949.jpg',NULL,NULL,0,0,'2026-01-29 12:29:49'),('ef938d70-662b-4fa4-b0ae-5aa277f069b0','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','https://raziastore.com/wp-content/uploads/2025/11/DSC_0981.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('f2910a34-a706-433f-804b-a71feccd1535','31fb8967-5828-46d9-a6d1-db9a2c444602','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301335-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('f57ce834-03c3-4811-8303-dbe9bff265b5','85310419-aa0e-487f-8739-c87696aad927','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301066-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:41'),('f6879e16-d0e6-413c-a60c-db8b8e547040','90327120-f77f-4241-b16e-46fb43526bf6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0761.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45'),('fa010db0-3081-43aa-bc30-229a8c197e3f','c25ef4fe-ee02-4301-9017-952031d9eef6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0793.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('fa4ef711-a62a-430e-84ef-2de4a7aef92f','0e5b2d04-41d2-4543-9b33-148a5493ac3c','https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301228-scaled-1.jpg',NULL,NULL,0,0,'2026-01-29 12:29:42'),('faf8d2c7-0ca8-4bbf-a201-8ae3263254e7','dec3f433-8f76-47ad-9498-965e17b21cc4','https://raziastore.com/wp-content/uploads/2025/11/DSC_0823.jpg',NULL,NULL,0,1,'2026-01-29 12:29:46'),('fbf20308-6eba-437c-b5b8-580f362f7446','c25ef4fe-ee02-4301-9017-952031d9eef6','https://raziastore.com/wp-content/uploads/2025/11/DSC_0794.jpg',NULL,NULL,0,0,'2026-01-29 12:29:47'),('ff7689ed-28df-421d-92b9-4c3061585cc6','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','https://raziastore.com/wp-content/uploads/2025/11/DSC_0859.jpg',NULL,NULL,0,0,'2026-01-29 12:29:45');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `color_hex` varchar(50) DEFAULT NULL,
  `price_adjustment` decimal(10,2) DEFAULT '0.00',
  `stock_quantity` int DEFAULT '0',
  `sku` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_product_variants_product` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES ('0511049e-0124-4b6d-b311-97149d718597','876db775-cb61-45c4-8c3f-06bbea2ecada','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:01'),('07e98042-6f90-4073-9eac-05139ebe2fd8','0be06292-8716-4860-bd73-6c54a37c68be','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('0889f13e-af4a-4193-b464-42cf4ad3bf38','b45c2710-2fa4-4d91-b736-2fe35a9c5974','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:01'),('0b9a7f2b-0b63-46cf-87c0-523888d574b8','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:06'),('0ea25819-0c89-4fd4-b3b2-d71afa6e773b','90327120-f77f-4241-b16e-46fb43526bf6','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('12206c26-2a68-4a0f-b3f0-666316e69410','90327120-f77f-4241-b16e-46fb43526bf6','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('12dacf9c-c72c-41d9-b264-f82e6e559e3d','85310419-aa0e-487f-8739-c87696aad927','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('12fdf579-f80d-45f2-b8ba-01b65e931c4e','8803db5c-d5f0-4d2a-bc31-ef8922f9b09f','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:00'),('14419d5e-fe10-4965-96bf-32dffd7183c2','0be06292-8716-4860-bd73-6c54a37c68be','S','Orange floral &amp; Green Palm',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('1603bb33-06ae-4df6-b2ea-2db833968a4f','0be06292-8716-4860-bd73-6c54a37c68be','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('18e21509-4e45-4edb-a947-a9bf8070e013','d510b0da-a019-4341-b8fb-3ea68c99d2aa','L','Orange',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('1b924fb4-2651-44ca-aef9-fa496ad9fcf0','0e5b2d04-41d2-4543-9b33-148a5493ac3c','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:03'),('1e6862fd-ce5a-43ce-942f-0739db7587d7','5dd8f623-41d8-4fb5-a2a8-b504b18b293f','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('20423c7e-5d1c-4059-a131-146c3a99dbcc','0be06292-8716-4860-bd73-6c54a37c68be','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('242af014-dffe-4b5f-829e-09bfaef29ec4','8b5a1822-1be3-4163-8480-01b5acdf765f','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('2557976b-f48a-46fb-b4ec-018a83480017','1797868b-8d02-415f-b87e-685fbd412597','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('26f9549f-6727-4022-af58-78afd43d430b','2b8aff25-5972-44ac-a36a-60e0cb03a84f','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('2cc7e23d-214b-4704-af5b-921509e14e3d','d510b0da-a019-4341-b8fb-3ea68c99d2aa','M','Dark Red',NULL,0.00,100,NULL,1,'2026-01-29 12:30:14'),('2f2d8e02-12db-407e-a9ff-a3abce5b3730','0be06292-8716-4860-bd73-6c54a37c68be','S','Green palm - Giraffe',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('31e4c2ed-cc51-40a2-8d21-22094b5c333d','7cd7317e-1c0f-4d0e-ace3-55a5f3b28283','Free size',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('3281b0be-8630-4019-a500-308d61f4b92c','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('352c8cb9-8b85-465a-84d5-66b2efb6a93e','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('3635f484-804e-45b3-8933-5748318ea551','0ec595e9-ccd7-400a-b7c8-c687237232ed','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('3659c8de-0e3a-4209-ad59-d2ab08141043','3328357b-a763-4324-a47b-5a35171b5792','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('36ddf8fd-62f9-407e-b2b5-d860ad8c8f06','0be06292-8716-4860-bd73-6c54a37c68be','XL','Green palm - Elephant',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('38431051-c842-4178-9705-84f4144124dd','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','L','Blue',NULL,0.00,100,NULL,1,'2026-01-29 12:29:55'),('38e3f74d-7b6f-4dc6-9466-6e2fe58f0e16','a693465d-6bff-4e93-b620-62e06123e64a','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('3de34294-b847-4d65-bda7-5786c7be1d39','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','XL','Blue',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('3e588b3b-2641-4e5a-a1ed-293b683f471c','1797868b-8d02-415f-b87e-685fbd412597','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:03'),('43f340ff-8eee-4b54-b22e-7da3d074a956','0be06292-8716-4860-bd73-6c54a37c68be','M','Green palm - Elephant',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('45c64c13-f3ef-4e24-8033-5d446e5ad890','708f6942-c9d2-4904-b0c3-8abdf3d05bd6','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:01'),('48e292a2-290f-46f3-8f34-cd78c875cb54','2b8aff25-5972-44ac-a36a-60e0cb03a84f','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('4a6e94a5-c2e7-4670-a62b-661d27e2305a','a693465d-6bff-4e93-b620-62e06123e64a','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('4be3eaa0-d669-410e-91d3-393026881387','dc7ae370-c7ca-4c17-b88b-98305b67511b','S','Blue',NULL,0.00,100,NULL,1,'2026-01-29 12:29:54'),('4c0c6c1e-badb-42d7-8bfe-4d5b12fb3f53','90327120-f77f-4241-b16e-46fb43526bf6','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('4e971c11-c2a9-4400-bb7e-221ac2a26a0e','876db775-cb61-45c4-8c3f-06bbea2ecada','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('4fdb89a6-c5d4-4665-9fb4-5fed0a53f150','3328357b-a763-4324-a47b-5a35171b5792','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('51716c36-7c1e-4b1a-83a8-3f708ada5be0','85310419-aa0e-487f-8739-c87696aad927','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('52085255-3acc-44dd-a353-cd8eb9bec06a','0be06292-8716-4860-bd73-6c54a37c68be','M','Orange floral &amp; Green Palm',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('567e133c-b108-4517-bf05-969e40a781a2','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('56caaabe-9559-4886-887d-cf4b54fcc31c','5dd8f623-41d8-4fb5-a2a8-b504b18b293f','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('57ae3769-c9c0-4716-9ea6-24768dfd5ef0','0be06292-8716-4860-bd73-6c54a37c68be','S','Green palm - Elephant',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('59f28612-6e20-4d5a-9d81-6ceed59762d2','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('5a68d49e-0924-41a4-b5ac-6b18c7a8c34d','c25ef4fe-ee02-4301-9017-952031d9eef6','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('5e3562cc-c585-4958-8550-1367ee070a89','58148fae-fd7a-4610-b13a-9fab21dfa6c5','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:10'),('5e523f7b-5b09-49a0-ac74-8da1e7f92bf9','dec3f433-8f76-47ad-9498-965e17b21cc4','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('5e55ae08-059b-48f7-bfea-3ccac68fa7d8','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','S','Pink',NULL,0.00,100,NULL,1,'2026-01-29 12:29:55'),('60081c56-0dd6-4446-946e-32aaa4c25c48','8803db5c-d5f0-4d2a-bc31-ef8922f9b09f','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('61583f91-af7c-4300-901f-7decfc90c632','8b5a1822-1be3-4163-8480-01b5acdf765f','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('65f99246-a32b-4c9d-b31e-faad8b3aea77','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('66582122-d04a-4d83-b0ac-7d3f249150a5','8b5a1822-1be3-4163-8480-01b5acdf765f','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('67a7c691-d813-4c56-9577-1da1ce4ceb0e','dc7ae370-c7ca-4c17-b88b-98305b67511b','S','Pink',NULL,0.00,100,NULL,1,'2026-01-29 12:29:54'),('67bfb83a-dcc1-4aec-b500-0c9f87531503','a693465d-6bff-4e93-b620-62e06123e64a','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('67d57cab-b0b1-4158-bf7f-4ee605fd9bde','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:06'),('6d7f468c-de6b-42a5-80f7-d8a9b8e720b3','3328357b-a763-4324-a47b-5a35171b5792','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('6f11059c-a400-4f13-8fea-731771e7e93f','d510b0da-a019-4341-b8fb-3ea68c99d2aa','L','Dark Red',NULL,0.00,100,NULL,1,'2026-01-29 12:30:14'),('71235f2d-2915-4982-8f48-e261c6b9bfff','58148fae-fd7a-4610-b13a-9fab21dfa6c5','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:10'),('71d96fe1-bea1-4c10-a08e-f79790fd2765','0be06292-8716-4860-bd73-6c54a37c68be','XL','Green palm - Flamingo',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('73fff1a1-1cdc-4b29-8d14-79d9552f6a4f','dc7ae370-c7ca-4c17-b88b-98305b67511b','L','Pink',NULL,0.00,100,NULL,1,'2026-01-29 12:29:54'),('783ed389-4a35-4d8e-b799-1b4caab4d566','0be06292-8716-4860-bd73-6c54a37c68be','S','Green palm - Flamingo',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('79c6a536-ed40-458e-bcd1-e4c262da0557','90327120-f77f-4241-b16e-46fb43526bf6','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('7a62a840-7e7f-4be3-b3f9-4facc1ad8924','85310419-aa0e-487f-8739-c87696aad927','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('7aedc5e7-d415-4fa1-95fd-54c97b40db79','0be06292-8716-4860-bd73-6c54a37c68be','XL','Green palm - Zebra',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('7c368468-ee75-400d-8afb-aab6626429e6','0be06292-8716-4860-bd73-6c54a37c68be','M','Orange floral print',NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('7caae0b3-95c8-49b6-836e-4e7c87cb8775','0be06292-8716-4860-bd73-6c54a37c68be','L','Green palm - Zebra',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('7feb92fc-7db7-4921-94b1-aa534674b22a','dec3f433-8f76-47ad-9498-965e17b21cc4','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('8183e7fa-363f-4446-8943-7eaa0436695c','0be06292-8716-4860-bd73-6c54a37c68be','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('81d53d0c-4599-4c91-acbb-9e2494d541fb','876db775-cb61-45c4-8c3f-06bbea2ecada','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('87ac14ef-04bb-4d5e-a1fc-224c63ea4154','708f6942-c9d2-4904-b0c3-8abdf3d05bd6','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:01'),('8815571f-3ab7-4a12-b5b1-50fbc0c6093f','0be06292-8716-4860-bd73-6c54a37c68be','M','Green palm - Flamingo',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('88570159-a2a6-400f-8132-f4914521062e','b45c2710-2fa4-4d91-b736-2fe35a9c5974','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('8912f77e-75bf-44c4-8562-b44d2a8cb10a','c25ef4fe-ee02-4301-9017-952031d9eef6','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:10'),('8a30b453-1f27-4d00-b2a0-291acc9dc1bd','0be06292-8716-4860-bd73-6c54a37c68be','M','Green palm - Giraffe',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('8b668c52-3be5-4f2a-a14e-87ecd705a735','c25ef4fe-ee02-4301-9017-952031d9eef6','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('8c3f772a-a154-4ffd-babc-4865db4ec803','3328357b-a763-4324-a47b-5a35171b5792','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('8f748d17-f233-49e4-a981-6a7541f644b9','dec3f433-8f76-47ad-9498-965e17b21cc4','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('9034325f-101f-4e8a-b760-5fe3aebaba7f','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('92925b57-20e1-4e11-bc1f-54f12cee34dc','2b8aff25-5972-44ac-a36a-60e0cb03a84f','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('95ea59cd-e144-4950-9581-c6fc38f3ee8f','876db775-cb61-45c4-8c3f-06bbea2ecada','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('96b5e0dd-b18e-4f33-a1fd-41d7feda09ff','100ce1fa-7565-452b-81c4-ac79ba7616ec','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:03'),('978d0c73-25bc-4bea-9199-d9526eb65ec5','a693465d-6bff-4e93-b620-62e06123e64a','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('9b626219-ff47-4205-bd89-6840f4002161','708f6942-c9d2-4904-b0c3-8abdf3d05bd6','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:01'),('9cff2c5e-d319-4209-ab36-dab2608d7cc7','0be06292-8716-4860-bd73-6c54a37c68be','L','Green palm - Giraffe',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('9e1c1327-906a-4d28-a4c4-a2b2a7d97190','8b5a1822-1be3-4163-8480-01b5acdf765f','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('a024ec6f-194d-4a8e-8e29-1644e881ec8b','85310419-aa0e-487f-8739-c87696aad927','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('a173a0b7-5f0e-4ed2-8c13-4435ebe3bc8e','0be06292-8716-4860-bd73-6c54a37c68be','XL','Orange floral &amp; Green Palm',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('a2d8e96b-c292-46fa-92c8-5457731fa82f','b45c2710-2fa4-4d91-b736-2fe35a9c5974','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:01'),('a6eb17f4-a3b3-4b34-8dac-65568a00f498','31fb8967-5828-46d9-a6d1-db9a2c444602',NULL,'',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('b15a0e96-fc5f-48a5-8027-883281ce9184','0e5b2d04-41d2-4543-9b33-148a5493ac3c','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:03'),('b1c72107-667c-43f5-b0ae-4248ebad5f99','dc7ae370-c7ca-4c17-b88b-98305b67511b','XL','Pink',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('b58be7ae-19ce-471b-8d88-d77b277e7d03','b45c2710-2fa4-4d91-b736-2fe35a9c5974','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:00'),('b615ed91-8a88-45a5-b577-7b28d5a0f524','58148fae-fd7a-4610-b13a-9fab21dfa6c5','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:10'),('b90117f1-3eb0-4f15-8af9-a078e2c915fe','d510b0da-a019-4341-b8fb-3ea68c99d2aa','XL','Grey',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('b93e77d0-4f24-4c61-8c84-4623b667205d','dc7ae370-c7ca-4c17-b88b-98305b67511b','L','Blue',NULL,0.00,100,NULL,1,'2026-01-29 12:29:54'),('ba1d3918-545a-4271-b1d7-2b2934aaf0d5','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:10'),('bb645d2e-6c59-414b-9fcb-7fa2856e58d7','100ce1fa-7565-452b-81c4-ac79ba7616ec','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:03'),('bc8666d6-d722-405a-964e-875293ade07f','d510b0da-a019-4341-b8fb-3ea68c99d2aa','M','Grey',NULL,0.00,100,NULL,1,'2026-01-29 12:30:14'),('be6b6281-980c-4aeb-b50d-0fb26fa04330','c25ef4fe-ee02-4301-9017-952031d9eef6','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:10'),('bf217ea6-e35f-4595-b169-4b32386369be','dc7ae370-c7ca-4c17-b88b-98305b67511b','M','Pink',NULL,0.00,100,NULL,1,'2026-01-29 12:29:54'),('c0507892-a17a-493b-b5b6-8fd60595dadb','0be06292-8716-4860-bd73-6c54a37c68be','L','Orange floral &amp; Green Palm',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('c0dff4f5-c6e2-4940-a91b-249cfc9431e6','1797868b-8d02-415f-b87e-685fbd412597','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:03'),('c3d0f02f-26a2-4709-bf9f-2dd45a687591','100ce1fa-7565-452b-81c4-ac79ba7616ec','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:03'),('c3f3c953-bae9-499f-a5b1-549b06f777c2','d510b0da-a019-4341-b8fb-3ea68c99d2aa','S','Grey',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('c8935844-c3b8-4e05-a468-c8d1c3e5ed82','0be06292-8716-4860-bd73-6c54a37c68be','M','Green palm - Zebra',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('c893d6f8-9050-4b75-bb94-b58ccadf4baa','0be06292-8716-4860-bd73-6c54a37c68be','L','Green palm - Flamingo',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('c943ec6a-367d-4727-b7b5-f86dc5325cc6','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','L','Pink',NULL,0.00,100,NULL,1,'2026-01-29 12:29:55'),('ce4d68cd-eab0-48d7-9b11-bdfd9c46e31d','0be06292-8716-4860-bd73-6c54a37c68be','L','Green palm - Elephant',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('d0b4f90b-c78e-406c-9ceb-2362663b7d74','0ec595e9-ccd7-400a-b7c8-c687237232ed','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('d1c1a2f8-bce3-4586-b0f3-549cb94de300','8803db5c-d5f0-4d2a-bc31-ef8922f9b09f','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:00'),('d40cf790-d9d7-47c7-9fc8-9b0681a6d2bc','0ec595e9-ccd7-400a-b7c8-c687237232ed','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('d6f09208-2f8f-476a-858d-be152188c51f','d510b0da-a019-4341-b8fb-3ea68c99d2aa','M','Orange',NULL,0.00,100,NULL,1,'2026-01-29 12:30:14'),('dbda4219-8761-405b-b939-1f216f4d7c05','708f6942-c9d2-4904-b0c3-8abdf3d05bd6','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:01'),('dcaca404-c8ea-482d-b1f7-cd0dbd3b0143','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','M','Blue',NULL,0.00,100,NULL,1,'2026-01-29 12:29:55'),('def76867-9c68-45cc-a224-4644b0e24650','609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2',NULL,'',NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('e0488eff-1334-45dc-97ca-d236a88740f8','0e5b2d04-41d2-4543-9b33-148a5493ac3c','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('e04fa2d5-3293-4745-9aa1-4070575b60cf','d510b0da-a019-4341-b8fb-3ea68c99d2aa','L','Grey',NULL,0.00,100,NULL,1,'2026-01-29 12:30:14'),('e06702b9-2bdf-480a-8cbf-1f5dc181f2e6','0be06292-8716-4860-bd73-6c54a37c68be','S','Green palm - Zebra',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('e271c117-f40f-4712-b293-fbbc2b875989','0e5b2d04-41d2-4543-9b33-148a5493ac3c','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('e53e780c-9b65-45cd-ad16-d1614bfbd4f9','dc7ae370-c7ca-4c17-b88b-98305b67511b','XL','Blue',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('e791284d-a8b6-412c-bf0e-9a75e471f6cb','100ce1fa-7565-452b-81c4-ac79ba7616ec','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:03'),('e795a500-0162-49d0-adda-5f847bb36b7c','2b8aff25-5972-44ac-a36a-60e0cb03a84f','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:02'),('e84c0cc8-3f20-4d2e-aa1e-78af660c37ac','8803db5c-d5f0-4d2a-bc31-ef8922f9b09f','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:00'),('ea3197d7-0d35-4908-ac2d-c2db4e2d306b','5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('ea77f95f-a501-47b4-81f8-7f8f378aa2c9','3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:10'),('ed1a6888-0f92-4f35-afd1-4fef1c4facdd','d510b0da-a019-4341-b8fb-3ea68c99d2aa','XL','Orange',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('ee719407-d032-49bc-bd18-be59773ed1f9','58148fae-fd7a-4610-b13a-9fab21dfa6c5','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:10'),('eec894e8-a2ad-4b96-b45b-cc15e39c454a','80a0cf58-4178-4f41-b5c4-bb22d71a67ba',NULL,'',NULL,0.00,100,NULL,1,'2026-01-29 12:29:58'),('eee7e357-8ed7-48cd-9ddc-01af4d9b16b2','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','XL','Pink',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('ef6b0a7d-1093-4e2f-8921-df664e345921','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','M','Pink',NULL,0.00,100,NULL,1,'2026-01-29 12:29:55'),('f4beb3cd-11b4-455e-9242-4fab106f6a48','d510b0da-a019-4341-b8fb-3ea68c99d2aa','S','Dark Red',NULL,0.00,100,NULL,1,'2026-01-29 12:30:13'),('f5c59244-8e3c-438e-b5dc-df0160ee3ac5','0ec595e9-ccd7-400a-b7c8-c687237232ed','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:11'),('f6bc571e-5efb-46bf-8968-aa311d7ec132','0be06292-8716-4860-bd73-6c54a37c68be','XL','Orange floral print',NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('f6d66a76-cc4c-4b43-9483-e426ebed6f67','dec3f433-8f76-47ad-9498-965e17b21cc4','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:05'),('f7527782-4ca6-4bc7-87b7-5f1e054dd4c5','0be06292-8716-4860-bd73-6c54a37c68be','L','Orange floral print',NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('f82ddf80-993c-4346-af47-07d34b71c2bd','0be06292-8716-4860-bd73-6c54a37c68be','XL','Green palm - Giraffe',NULL,0.00,100,NULL,1,'2026-01-29 12:30:12'),('f8a55ae4-b3b6-4636-90c0-42bd0e380bc6','5b1c97e8-03fd-4c87-9714-833e2a5eefaa','S','Blue',NULL,0.00,100,NULL,1,'2026-01-29 12:29:55'),('f9744e16-2df5-4f02-952d-fe157dc5131a','d510b0da-a019-4341-b8fb-3ea68c99d2aa','XL','Dark Red',NULL,0.00,100,NULL,1,'2026-01-29 12:30:15'),('f97f7f2c-8e16-43f6-8bb1-0a1a100d8e34','d6257bf5-9b86-4e32-9e31-8c4e5eb82809','S',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('f9e50ab6-0be7-4b4f-bef2-f53b74d43722','0be06292-8716-4860-bd73-6c54a37c68be','S','Orange floral print',NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('fb5de854-b727-4824-a9ad-2582197ac4eb','1797868b-8d02-415f-b87e-685fbd412597','L',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('fbca6179-d8be-4605-9801-00eb32a209a3','dc7ae370-c7ca-4c17-b88b-98305b67511b','M','Blue',NULL,0.00,100,NULL,1,'2026-01-29 12:29:54'),('fc778eda-e61b-4d32-a4f2-8a60e0ef1923','5dd8f623-41d8-4fb5-a2a8-b504b18b293f','M',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:04'),('fddcacdc-93b2-43db-b5fa-9d7cc564dba1','d510b0da-a019-4341-b8fb-3ea68c99d2aa','S','Orange',NULL,0.00,100,NULL,1,'2026-01-29 12:30:14'),('fe2f18fe-e36c-4509-b4b5-2bd663231c34','5dd8f623-41d8-4fb5-a2a8-b504b18b293f','XL',NULL,NULL,0.00,100,NULL,1,'2026-01-29 12:30:15');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description_en` text,
  `description_ar` text,
  `price` decimal(10,2) NOT NULL,
  `compare_at_price` decimal(10,2) DEFAULT NULL,
  `category_id` char(36) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_new` tinyint(1) DEFAULT '0',
  `tags` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_url` text,
  `discount_type` varchar(50) DEFAULT 'no_discount',
  `discount_value` decimal(10,2) DEFAULT '0.00',
  `shipping_width` decimal(10,2) DEFAULT '0.00',
  `shipping_height` decimal(10,2) DEFAULT '0.00',
  `shipping_weight` decimal(10,2) DEFAULT '0.00',
  `shipping_cost` decimal(10,2) DEFAULT '0.00',
  `colors` json DEFAULT NULL,
  `sizes` json DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `quantity` int DEFAULT '0',
  `ai_tags` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_is_active` (`is_active`),
  KEY `idx_products_is_featured` (`is_featured`),
  KEY `idx_cat_price` (`category_id`,`price`),
  KEY `idx_created_at` (`created_at`),
  FULLTEXT KEY `idx_fulltext_search` (`name_en`,`description_en`),
  FULLTEXT KEY `idx_product_search` (`name_en`,`name_ar`,`description_en`,`description_ar`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('0be06292-8716-4860-bd73-6c54a37c68be','White Layered Maxi Dress with Orange floral Belt OR Green Palm Belt','White Layered Maxi Dress with Orange floral Belt OR Green Palm Belt',NULL,'This flowing white dress captures effortless elegance with its artistic flair. The layered skirt detail comes in two distinctive patterns - a lively orange floral print and a green palm-and-animal design - offering a modern touch of individuality to each piece. With its lightweight drape and soft texture, itΓÇÖs perfect for special occasions. Designed for the woman who loves to blend modesty with contemporary expression.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon','This flowing white dress captures effortless elegance with its artistic flair. The layered skirt detail comes in two distinctive patterns - a lively orange floral print and a green palm-and-animal design - offering a modern touch of individuality to each piece. With its lightweight drape and soft texture, itΓÇÖs perfect for special occasions. Designed for the woman who loves to blend modesty with contemporary expression.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon',0.00,NULL,'0a1fdb2b-8fe1-4c7a-9ebc-9048e18af8ef','A001',0,1,0,0,NULL,'2026-01-29 12:29:44','2026-01-29 12:30:15',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[\"Orange floral &amp; Green Palm\", \"Green palm - Giraffe\", \"Green palm - Elephant\", \"Green palm - Flamingo\", \"Green palm - Zebra\", \"Orange floral print\"]','[\"S\", \"L\", \"XL\", \"M\"]',0,0,NULL),('0d0ce9f9-9f7d-43fe-bd95-dc95a3ef93ea','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:51','2026-01-29 12:30:15',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('0e5b2d04-41d2-4543-9b33-148a5493ac3c','Colorful modern vest','Colorful modern vest',NULL,'A stylish vest that merges┬áease with personality, crafted\r\n\\nfrom a soft and airy linen blend. Featuring bold,┬átraditional-inspired embroidery┬áin rich reds and blues, framed┬áby a modern green edge. It\'s a lightweight layering piece that\r\n\\nelevates any outfit - casual or polished - with effortless flair\r\n\\n\r\n\\nFabric: Linen\r\n\\n\r\n\\n&nbsp;','A stylish vest that merges┬áease with personality, crafted\r\n\\nfrom a soft and airy linen blend. Featuring bold,┬átraditional-inspired embroidery┬áin rich reds and blues, framed┬áby a modern green edge. It\'s a lightweight layering piece that\r\n\\nelevates any outfit - casual or polished - with effortless flair\r\n\\n\r\n\\nFabric: Linen\r\n\\n\r\n\\n&nbsp;',0.00,NULL,'42990a2e-6fa7-4ae4-b80c-1c957b6925dd','S008',0,1,0,0,NULL,'2026-01-29 12:29:42','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"L\", \"XL\", \"M\", \"S\"]',0,0,NULL),('0ec595e9-ccd7-400a-b7c8-c687237232ed','Two-Layer Top in Green and Beige Leaf Pattern','Two-Layer Top in Green and Beige Leaf Pattern',NULL,'This layered top blends texture and tone in perfect harmony. The upper layer features a subtle leaf pattern in beige, while the green underlayer adds depth and calm sophistication. Its relaxed fit and lightweight fabric make it ideal for everyday elegance or refined casual wear. A piece that reflects RaziaΓÇÖs signature balance - modest, modern, and beautifully composed.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon &amp; Linen Crepe','This layered top blends texture and tone in perfect harmony. The upper layer features a subtle leaf pattern in beige, while the green underlayer adds depth and calm sophistication. Its relaxed fit and lightweight fabric make it ideal for everyday elegance or refined casual wear. A piece that reflects RaziaΓÇÖs signature balance - modest, modern, and beautifully composed.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon &amp; Linen Crepe',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A011',0,1,0,0,NULL,'2026-01-29 12:29:49','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"S\", \"M\", \"XL\", \"L\"]',0,0,NULL),('100ce1fa-7565-452b-81c4-ac79ba7616ec','Linen Jumpsuit with Embroidered Side Panel','Linen Jumpsuit with Embroidered Side Panel',NULL,'<span class=\"trx_addons_accent\">This modern navy jumpsuit is crafted from soft,┬á</span><span class=\"trx_addons_accent\">lightweight linen that moves effortlessly with you.┬á</span><span class=\"trx_addons_accent\">The standout feature is the embroidered side panel,┬á</span><span class=\"trx_addons_accent\">designed with rich, traditional-inspired motifs in vibrant colors like┬á</span><span class=\"trx_addons_accent\">red , green , and navy. The embroidery adds a statement-making touch,┬á</span><span class=\"trx_addons_accent\">balancing comfort with confident elegance. it\'s a piece made for women who┬á</span><span class=\"trx_addons_accent\">value both ease and individuality in their everyday style\r\n\\n</span>\r\n\\n\r\n\\n<span class=\"trx_addons_accent\">Fabric: Linen\r\n\\n</span>\r\n\\n\r\n\\n&nbsp;','<span class=\"trx_addons_accent\">This modern navy jumpsuit is crafted from soft,┬á</span><span class=\"trx_addons_accent\">lightweight linen that moves effortlessly with you.┬á</span><span class=\"trx_addons_accent\">The standout feature is the embroidered side panel,┬á</span><span class=\"trx_addons_accent\">designed with rich, traditional-inspired motifs in vibrant colors like┬á</span><span class=\"trx_addons_accent\">red , green , and navy. The embroidery adds a statement-making touch,┬á</span><span class=\"trx_addons_accent\">balancing comfort with confident elegance. it\'s a piece made for women who┬á</span><span class=\"trx_addons_accent\">value both ease and individuality in their everyday style\r\n\\n</span>\r\n\\n\r\n\\n<span class=\"trx_addons_accent\">Fabric: Linen\r\n\\n</span>\r\n\\n\r\n\\n&nbsp;',0.00,NULL,'3eb1e3e7-87a5-41a5-b9d5-83d76b984898','S007',0,1,0,0,NULL,'2026-01-29 12:29:42','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"S\", \"L\", \"M\", \"XL\"]',0,0,NULL),('176edfbc-d821-414e-8e3a-004525853657','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:50','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('1797868b-8d02-415f-b87e-685fbd412597','Blouse with Colorful Shawl','Blouse with Colorful Shawl',NULL,'A relaxed, flowy blouse completed with a vibrant colorful scarf that adds a an artistic touch. Designed with lightweight fabric for comfort and elegance. Perfect for casual outings or stylish gatherings.\r\n\\n\r\n\\nFabric:63% viscose &amp; 37% Cotton','A relaxed, flowy blouse completed with a vibrant colorful scarf that adds a an artistic touch. Designed with lightweight fabric for comfort and elegance. Perfect for casual outings or stylish gatherings.\r\n\\n\r\n\\nFabric:63% viscose &amp; 37% Cotton',0.00,NULL,'99e4cd8a-d7e0-41b0-8068-b8318647a784','S006',0,1,0,0,NULL,'2026-01-29 12:29:41','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"S\", \"M\", \"L\"]',0,0,NULL),('1b9ffc7a-0995-4e31-92b1-656e5ec315c9','test refund 2','test refund 2',NULL,'','',0.00,NULL,'54b998a3-2ba5-4903-aa55-af3e9ccf2d42',NULL,0,1,0,0,NULL,'2026-01-29 12:29:54','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('2b8aff25-5972-44ac-a36a-60e0cb03a84f','Classic White Crepe Satin Shirt','Classic White Crepe Satin Shirt',NULL,'A modern staple with a touch of elegance, this white shirt is made from crepe satin that drapes beautifully and feels silky-soft against the skin. With its structured collar and clean silhouette, itΓÇÖs designed to be┬áyour go-to piece for layering under┬ástatement vests or styling. Light yet┬árefined, it balances comfort with┬ásophistication.\r\n\\n\r\n\\nFabric:\r\n\\n\r\n\\nCrepe Satin\r\n\\n\r\n\\n&nbsp;','A modern staple with a touch of elegance, this white shirt is made from crepe satin that drapes beautifully and feels silky-soft against the skin. With its structured collar and clean silhouette, itΓÇÖs designed to be┬áyour go-to piece for layering under┬ástatement vests or styling. Light yet┬árefined, it balances comfort with┬ásophistication.\r\n\\n\r\n\\nFabric:\r\n\\n\r\n\\nCrepe Satin\r\n\\n\r\n\\n&nbsp;',0.00,NULL,'99e4cd8a-d7e0-41b0-8068-b8318647a784','S009',0,1,0,0,NULL,'2026-01-29 12:29:42','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"S\", \"L\", \"XL\", \"M\"]',0,0,NULL),('2f2df491-71e4-4e48-8069-484e125f37cf','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:53','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('31fb8967-5828-46d9-a6d1-db9a2c444602','Wavy Satin Blouse','Wavy Satin Blouse',NULL,'Made to move with you, this satin┬áblouse features a soft wavy blue or pink┬áthat captures the spirit of calm and┬ámotion. Its loose cut, and gathered┬ásleeves blend comfort and┬ásophistication. Whether styled casually┬áor elevated for evening wear, this blouse┬áadds an artistic twist to any outfit.\r\n\\n\r\n\\nFabric: Satin','Made to move with you, this satin┬áblouse features a soft wavy blue or pink┬áthat captures the spirit of calm and┬ámotion. Its loose cut, and gathered┬ásleeves blend comfort and┬ásophistication. Whether styled casually┬áor elevated for evening wear, this blouse┬áadds an artistic twist to any outfit.\r\n\\n\r\n\\nFabric: Satin',0.00,NULL,'99e4cd8a-d7e0-41b0-8068-b8318647a784','S1015',0,1,0,0,NULL,'2026-01-29 12:29:42','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('3328357b-a763-4324-a47b-5a35171b5792','Beige Printed Dress','Beige Printed Dress',NULL,'This statement piece redefines contemporary modest fashion with its asymmetric design and artistic safari-inspired print. The beige and ivory palette offers a timeless elegance, while the flowing cut allows it to be layered effortlessly over a blouse and trousers for a modern, structured silhouette. The detailed nature print adds a touch of character, making it a standout piece for those who appreciate creative elegance and versatility.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nCotton Taffeta','This statement piece redefines contemporary modest fashion with its asymmetric design and artistic safari-inspired print. The beige and ivory palette offers a timeless elegance, while the flowing cut allows it to be layered effortlessly over a blouse and trousers for a modern, structured silhouette. The detailed nature print adds a touch of character, making it a standout piece for those who appreciate creative elegance and versatility.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nCotton Taffeta',0.00,NULL,'0a1fdb2b-8fe1-4c7a-9ebc-9048e18af8ef','A008',0,1,0,0,NULL,'2026-01-29 12:29:47','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"S\", \"L\", \"M\"]',0,0,NULL),('3ecc6ba7-5eb7-4ce3-b4d0-024255f52604','Beige Leaf-Patterned Wide-Leg Trousers','Beige Leaf-Patterned Wide-Leg Trousers',NULL,'This wide-leg trouser combines comfort with refined simplicity. The high waist and built-in white belt enhance the silhouette, while the soft leaf-patterned texture adds a natural, elegant touch. Crafted from breathable linen crepe, they flow beautifully with every step. Pair them with a patterned top for a cohesive statement or with a plain blouse for an effortless, modern look.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nLinen Crepe','This wide-leg trouser combines comfort with refined simplicity. The high waist and built-in white belt enhance the silhouette, while the soft leaf-patterned texture adds a natural, elegant touch. Crafted from breathable linen crepe, they flow beautifully with every step. Pair them with a patterned top for a cohesive statement or with a plain blouse for an effortless, modern look.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nLinen Crepe',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A005',0,1,0,0,NULL,'2026-01-29 12:29:46','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"M\", \"S\", \"L\", \"XL\"]',0,0,NULL),('41798058-5ef8-4c8e-bc08-9c9061d53626','Untitled Product','Untitled Product',NULL,'<strong>Mix &amp; Match and enjoy 10% discount┬á</strong>','<strong>Mix &amp; Match and enjoy 10% discount┬á</strong>',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:44','2026-01-29 12:30:16',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('42418a8b-4cfe-4b10-989f-042a67ea87d1','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:50','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('42dc52f3-1510-42da-bfb5-d75de97be6f6','test refund 1','test refund 1',NULL,'','',0.00,NULL,'54b998a3-2ba5-4903-aa55-af3e9ccf2d42',NULL,0,1,0,0,NULL,'2026-01-29 12:29:54','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('58148fae-fd7a-4610-b13a-9fab21dfa6c5','Grey Layered Wide-Leg Trouser','Grey Layered Wide-Leg Trouser',NULL,'This layered trouser elevates minimalism with their clean silhouette and soft structure. Crafted in a single shade of grey, the front layer adds subtle depth and movement while maintaining a refined flow. Designed for effortless versatility, they can be paired with a matching neutral top for a monochrome statement or styled with bold tones for a striking contrast. A timeless piece that captures RaziaΓÇÖs modern, modest sophistication.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon','This layered trouser elevates minimalism with their clean silhouette and soft structure. Crafted in a single shade of grey, the front layer adds subtle depth and movement while maintaining a refined flow. Designed for effortless versatility, they can be paired with a matching neutral top for a monochrome statement or styled with bold tones for a striking contrast. A timeless piece that captures RaziaΓÇÖs modern, modest sophistication.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A006',0,1,0,0,NULL,'2026-01-29 12:29:47','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"M\", \"XL\", \"L\", \"S\"]',0,0,NULL),('5b1c97e8-03fd-4c87-9714-833e2a5eefaa','Wavy Satin Trouser','Wavy Satin Trouser',NULL,'This wavy wide trouser is where comfort meets modern elegance. With their relaxed wide-leg cut and soft, fluid fabric, they create graceful movement with every step. The unique wavy tone adds depth and a subtle statement to your look - whether styled with a matching blouse or plain blouse, itΓÇÖs your go-to for refined everyday dressing.\r\n\\n\r\n\\nFabric: Satin','This wavy wide trouser is where comfort meets modern elegance. With their relaxed wide-leg cut and soft, fluid fabric, they create graceful movement with every step. The unique wavy tone adds depth and a subtle statement to your look - whether styled with a matching blouse or plain blouse, itΓÇÖs your go-to for refined everyday dressing.\r\n\\n\r\n\\nFabric: Satin',0.00,NULL,'9ac81e0c-147d-4040-ad76-638320026eb0','S013',0,1,0,0,NULL,'2026-01-29 12:29:43','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[\"Blue\", \"Pink\"]','[\"L\", \"XL\", \"S\", \"M\"]',0,0,NULL),('5c23fe6c-a658-4cfe-8cbf-c9ed1c3d2e14','Beige Wide-Leg Trousers with Front and Back Layers','Beige Wide-Leg Trousers with Front and Back Layers',NULL,'This trouser combine fluid movement with understated sophistication. The front and back layers create a sculpted drape that enhances the natural flow of the silhouette, while the soft beige pattern - inspired by organic forms - adds texture and depth. Crafted from breathable linen crepe, this piece embodies RaziaΓÇÖs refined ease and modern modesty, perfect for effortless elegance from day to night.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nLinen Crepe','This trouser combine fluid movement with understated sophistication. The front and back layers create a sculpted drape that enhances the natural flow of the silhouette, while the soft beige pattern - inspired by organic forms - adds texture and depth. Crafted from breathable linen crepe, this piece embodies RaziaΓÇÖs refined ease and modern modesty, perfect for effortless elegance from day to night.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nLinen Crepe',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A012',0,1,0,0,NULL,'2026-01-29 12:29:49','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"S\", \"XL\", \"L\", \"M\"]',0,0,NULL),('5dd8f623-41d8-4fb5-a2a8-b504b18b293f','White & Light Purple Panel Top','White & Light Purple Panel Top',NULL,'This sleek white top is elevated with structured blue panels along the neckline, sleeves, and center front. Crafted from soft crepe satin, smooth, .The silhouette is clean and refined - perfect for pairing with statement bottoms or worn alone for a crisp, modern look\r\n\\nFabric: Crepe satin','This sleek white top is elevated with structured blue panels along the neckline, sleeves, and center front. Crafted from soft crepe satin, smooth, .The silhouette is clean and refined - perfect for pairing with statement bottoms or worn alone for a crisp, modern look\r\n\\nFabric: Crepe satin',0.00,NULL,'99e4cd8a-d7e0-41b0-8068-b8318647a784','S001',0,1,0,0,NULL,'2026-01-29 12:29:41','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"S\", \"L\", \"M\", \"XL\"]',0,0,NULL),('609e723c-bbc3-4fc8-8f73-2ad69b5cdfb2','Green Blouse with Attached Shawl','Green Blouse with Attached Shawl',NULL,'Effortlessly graceful, this green blouse combines structure with softness. Crafted from, it features an attached shawl that falls naturally over one shoulder, creating movement and a modern layered effect. The relaxed silhouette makes it a versatile piece - perfect for both casual refinement and evening sophistication. A true embodiment of RaziaΓÇÖs philosophy: modesty with a contemporary twist.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon','Effortlessly graceful, this green blouse combines structure with softness. Crafted from, it features an attached shawl that falls naturally over one shoulder, creating movement and a modern layered effect. The relaxed silhouette makes it a versatile piece - perfect for both casual refinement and evening sophistication. A true embodiment of RaziaΓÇÖs philosophy: modesty with a contemporary twist.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A009',0,1,0,0,NULL,'2026-01-29 12:29:48','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('708f6942-c9d2-4904-b0c3-8abdf3d05bd6','Flow Trouser with Side Blisseh','Flow Trouser with Side Blisseh',NULL,'This wide leg trouser comes in a soft pistachio tone and feature a side slit that unveils structured pleats as you move. The layered detail adds unexpected depth and movement, taking your look from simple to statement. Style them with a colorful blouse for a perfectly balanced outfit thatΓÇÖs both relaxed and elegance\r\n\\n\r\n\\nfabric:\r\n\\n\r\n\\nLinen &amp; viscose','This wide leg trouser comes in a soft pistachio tone and feature a side slit that unveils structured pleats as you move. The layered detail adds unexpected depth and movement, taking your look from simple to statement. Style them with a colorful blouse for a perfectly balanced outfit thatΓÇÖs both relaxed and elegance\r\n\\n\r\n\\nfabric:\r\n\\n\r\n\\nLinen &amp; viscose',0.00,NULL,'9ac81e0c-147d-4040-ad76-638320026eb0','S011',0,1,0,0,NULL,'2026-01-29 12:29:43','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"L\", \"M\", \"S\"]',0,0,NULL),('76a804e3-3083-40f4-a5cb-d4492e2cbea0','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:50','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('7cd7317e-1c0f-4d0e-ace3-55a5f3b28283','Printed Skirt Overlay','Printed Skirt Overlay',NULL,'This printed skirt is made to stand out.┬áDesigned as an overlay, it ties at the waist┬áand drapes effortlessly over trousers and┬áskirt, adding texture, movement, and┬ácontrast to your outfit. The vibrant wavy┬áprint in fuchsia and blue makes it a┬ástatement layer you can style in endless┬áways ΓÇö whether to elevate a matching set┬áor refresh a minimalist look with bold color┬áand fluid shape.\r\n\\n\r\n\\nFabric: rayon','This printed skirt is made to stand out.┬áDesigned as an overlay, it ties at the waist┬áand drapes effortlessly over trousers and┬áskirt, adding texture, movement, and┬ácontrast to your outfit. The vibrant wavy┬áprint in fuchsia and blue makes it a┬ástatement layer you can style in endless┬áways ΓÇö whether to elevate a matching set┬áor refresh a minimalist look with bold color┬áand fluid shape.\r\n\\n\r\n\\nFabric: rayon',0.00,NULL,'ecdfa51a-1c2e-4822-85a4-43205b7eddd4','S014',0,1,0,0,NULL,'2026-01-29 12:29:43','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"Free size\"]',0,0,NULL),('80a0cf58-4178-4f41-b5c4-bb22d71a67ba','Wavy Satin Trouser with Printed Skirt Overlay','Wavy Satin Trouser with Printed Skirt Overlay',NULL,'This wavy wide trouser is where┬ácomfort meets modern elegance. With┬átheir relaxed wide-leg cut and soft,┬áfluid fabric, they create graceful┬ámovement with every step. The unique┬áwavy tone adds depth and a subtle┬ástatement to your look ΓÇö whether┬ástyled with a matching blouse or plain┬áblouse, itΓÇÖs your go-to for refined┬áeveryday dressing\r\n\\n\r\n\\nFabric: Satin','This wavy wide trouser is where┬ácomfort meets modern elegance. With┬átheir relaxed wide-leg cut and soft,┬áfluid fabric, they create graceful┬ámovement with every step. The unique┬áwavy tone adds depth and a subtle┬ástatement to your look ΓÇö whether┬ástyled with a matching blouse or plain┬áblouse, itΓÇÖs your go-to for refined┬áeveryday dressing\r\n\\n\r\n\\nFabric: Satin',0.00,NULL,'9ac81e0c-147d-4040-ad76-638320026eb0','S016',0,1,0,0,NULL,'2026-01-29 12:29:44','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('85310419-aa0e-487f-8739-c87696aad927','Wide-Leg Trouser with Colorful Side Skirt','Wide-Leg Trouser with Colorful Side Skirt',NULL,'Wide-leg trousers made from a viscose-linen┬áblend, featuring a colorful wrap skirt tied at\r\n\\nthe waist for a bold, standout look.┬áThese wide-leg trousers come in a soft purple┬áshade and are made from lightweight crepe┬áfabric for a comfortable, relaxed fit. A colorful┬áprinted skirt is layered on one side at the┬áwaist, adding a stylish and playful touch. The\r\n\\nprint combines navy, pink, and white in soft┬ápatterns that add a fresh, colorful twist. ItΓÇÖs a┬ástylish piece that feels light, unique, and easy┬áto style for any occasion\r\n\\n\r\n\\nFabric:\r\n\\ntrouser: crepe skirt:63% viscose &amp; 37% linen','Wide-leg trousers made from a viscose-linen┬áblend, featuring a colorful wrap skirt tied at\r\n\\nthe waist for a bold, standout look.┬áThese wide-leg trousers come in a soft purple┬áshade and are made from lightweight crepe┬áfabric for a comfortable, relaxed fit. A colorful┬áprinted skirt is layered on one side at the┬áwaist, adding a stylish and playful touch. The\r\n\\nprint combines navy, pink, and white in soft┬ápatterns that add a fresh, colorful twist. ItΓÇÖs a┬ástylish piece that feels light, unique, and easy┬áto style for any occasion\r\n\\n\r\n\\nFabric:\r\n\\ntrouser: crepe skirt:63% viscose &amp; 37% linen',0.00,NULL,'ecdfa51a-1c2e-4822-85a4-43205b7eddd4','S004',0,1,0,0,NULL,'2026-01-29 12:29:41','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"M\", \"S\", \"L\"]',0,0,NULL),('876db775-cb61-45c4-8c3f-06bbea2ecada','Wavy  Blouse','Wavy  Blouse',NULL,'This blouse is made from lightweight┬áwith a silky finish and relaxed┬ásilhouette. The print blends cool┬áshades of blue and green in a┬ámodern, expressive design. Perfect┬áfor everyday looks or dressed-up┬ámoments, it offers both comfort and┬áedge.\r\n\\n\r\n\\nFabric:\r\n\\n\r\n\\nRayon','This blouse is made from lightweight┬áwith a silky finish and relaxed┬ásilhouette. The print blends cool┬áshades of blue and green in a┬ámodern, expressive design. Perfect┬áfor everyday looks or dressed-up┬ámoments, it offers both comfort and┬áedge.\r\n\\n\r\n\\nFabric:\r\n\\n\r\n\\nRayon',0.00,NULL,'99e4cd8a-d7e0-41b0-8068-b8318647a784','S012',0,1,0,0,NULL,'2026-01-29 12:29:43','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"S\", \"XL\", \"M\", \"L\"]',0,0,NULL),('8803db5c-d5f0-4d2a-bc31-ef8922f9b09f','Pistachio Flowy Trouser','Pistachio Flowy Trouser',NULL,'This wide-leg trouser are tailored from a luxurious viscose and linen blend that offers both structure and softness. The fabric is breathable, it moves naturally with your body, making it ideal for daily wear, warm weather, or relaxed occasions. The pistachio tone adds a refreshing twist while keeping your look clean and elevated - perfect for pairing with both basics and bold layers\r\n\\n\r\n\\nFabric\r\n\\nTrouser: 62% viscose 38% LINEN\r\n\\n\r\n\\n&nbsp;','This wide-leg trouser are tailored from a luxurious viscose and linen blend that offers both structure and softness. The fabric is breathable, it moves naturally with your body, making it ideal for daily wear, warm weather, or relaxed occasions. The pistachio tone adds a refreshing twist while keeping your look clean and elevated - perfect for pairing with both basics and bold layers\r\n\\n\r\n\\nFabric\r\n\\nTrouser: 62% viscose 38% LINEN\r\n\\n\r\n\\n&nbsp;',0.00,NULL,'9ac81e0c-147d-4040-ad76-638320026eb0','S002',0,1,0,0,NULL,'2026-01-29 12:29:43','2026-01-29 12:30:17',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"L\", \"XL\", \"M\", \"S\"]',0,0,NULL),('8b5a1822-1be3-4163-8480-01b5acdf765f','Elegant Top with Detachable Shawl','Elegant Top with Detachable Shawl',NULL,'This dark red top merges sophistication and versatility in one timeless design. The detachable shawl, embellished with delicate off-white flowers, adds an artistic and feminine touch that elevates the look from simple to striking. Whether worn draped for a soft, romantic silhouette or removed for a cleaner finish, this piece offers effortless styling for every occasion.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon','This dark red top merges sophistication and versatility in one timeless design. The detachable shawl, embellished with delicate off-white flowers, adds an artistic and feminine touch that elevates the look from simple to striking. Whether worn draped for a soft, romantic silhouette or removed for a cleaner finish, this piece offers effortless styling for every occasion.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A010',0,1,0,0,NULL,'2026-01-29 12:29:48','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"M\", \"S\", \"L\"]',0,0,NULL),('8bfb3ff1-bc8d-4cb6-b213-659acd9a3cc6','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:50','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('90327120-f77f-4241-b16e-46fb43526bf6','Jumpsuit with Patterned Skirt Layer and Jacket','Jumpsuit with Patterned Skirt Layer and Jacket',NULL,'This outfit redefines elegance with structure and flow. The olive-green sleeveless jumpsuit forms the base, accentuated by a detachable belt that highlights the waistline. The beige patterned skirt layer adds soft movement, while the cropped jacket completes the look with balanced sophistication. Versatile, graceful, and bold - this design captures RaziaΓÇÖs signature blend of confidence and contemporary modesty.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon','This outfit redefines elegance with structure and flow. The olive-green sleeveless jumpsuit forms the base, accentuated by a detachable belt that highlights the waistline. The beige patterned skirt layer adds soft movement, while the cropped jacket completes the look with balanced sophistication. Versatile, graceful, and bold - this design captures RaziaΓÇÖs signature blend of confidence and contemporary modesty.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon',0.00,NULL,'3eb1e3e7-87a5-41a5-b9d5-83d76b984898','A003',0,1,0,0,NULL,'2026-01-29 12:29:45','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"S\", \"M\", \"L\"]',0,0,NULL),('a693465d-6bff-4e93-b620-62e06123e64a','Drape Elegant Trouser','Drape Elegant Trouser',NULL,'Bring movement and modern elegance to your wardrobe with┬áthis wide-leg trouser in a dreamy lavender blue. Made from┬álightweight crepe, the fabric offers a soft yet structured feel with┬ábeautiful natural movement. The relaxed cut adds to the comfort,\r\n\\nmaking them perfect for elevated daily wear or dressed-up casual┬álooks.\r\n\\n\r\n\\nFabric: crepe','Bring movement and modern elegance to your wardrobe with┬áthis wide-leg trouser in a dreamy lavender blue. Made from┬álightweight crepe, the fabric offers a soft yet structured feel with┬ábeautiful natural movement. The relaxed cut adds to the comfort,\r\n\\nmaking them perfect for elevated daily wear or dressed-up casual┬álooks.\r\n\\n\r\n\\nFabric: crepe',0.00,NULL,'9ac81e0c-147d-4040-ad76-638320026eb0','S005',0,1,0,0,NULL,'2026-01-29 12:29:41','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"L\", \"M\", \"S\"]',0,0,NULL),('b45c2710-2fa4-4d91-b736-2fe35a9c5974','Pistachio Trouser with Blisseh Skirt Overlay','Pistachio Trouser with Blisseh Skirt Overlay',NULL,'This trouser is designed to give you the perfect blend of comfort and standout style. It features a soft pistachio tone with a relaxed wide-leg cut, topped\r\n\\nwith a light blisseh skirt layer at the waist that adds graceful movement and flow. A perfect piece for everyday wear or evening looks - it brings\r\n\\neffortless elegance.\r\n\\n\r\n\\nFabric:\r\n\\ntrouser: linen &amp; viscose\r\n\\nSkirt: blisseh','This trouser is designed to give you the perfect blend of comfort and standout style. It features a soft pistachio tone with a relaxed wide-leg cut, topped\r\n\\nwith a light blisseh skirt layer at the waist that adds graceful movement and flow. A perfect piece for everyday wear or evening looks - it brings\r\n\\neffortless elegance.\r\n\\n\r\n\\nFabric:\r\n\\ntrouser: linen &amp; viscose\r\n\\nSkirt: blisseh',0.00,NULL,'9ac81e0c-147d-4040-ad76-638320026eb0','S003',0,1,0,0,NULL,'2026-01-29 12:29:43','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"M\", \"XL\", \"L\", \"S\"]',0,0,NULL),('c04fe474-67ae-47c6-999d-3d0681360a71','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:50','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('c25ef4fe-ee02-4301-9017-952031d9eef6','Beige Top with Side Tie','Beige Top with Side Tie',NULL,'This beige wrap top is designed to blend comfort with refined structure. The asymmetric cut - shorter at the front and longer at the back - creates a graceful flow, while the side tie adds definition to the waist. Crafted with smooth draping fabric, it moves effortlessly with the body, offering a versatile piece that pairs beautifully with trousers. A modern essential that reflects RaziaΓÇÖs timeless balance of ease and elegance.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon','This beige wrap top is designed to blend comfort with refined structure. The asymmetric cut - shorter at the front and longer at the back - creates a graceful flow, while the side tie adds definition to the waist. Crafted with smooth draping fabric, it moves effortlessly with the body, offering a versatile piece that pairs beautifully with trousers. A modern essential that reflects RaziaΓÇÖs timeless balance of ease and elegance.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A007',0,1,0,0,NULL,'2026-01-29 12:29:47','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"S\", \"L\", \"M\"]',0,0,NULL),('d38cdac8-5c58-4d03-99da-d949fe9c7986','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:49','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('d510b0da-a019-4341-b8fb-3ea68c99d2aa','Wide-Leg Trousers with Pockets','Wide-Leg Trousers with Pockets',NULL,'These wide-leg trousers radiate bold sophistication with their different colors and effortlessly fluid silhouette. Designed with side pockets for function and ease, they strike the perfect balance between practicality and statement style. The clean lines and soft drape make them ideal for both everyday wear and elevated occasions. Pair them with a patterned top for a modern contrast or a simple pattern for a monochrome look that commands attention.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon','These wide-leg trousers radiate bold sophistication with their different colors and effortlessly fluid silhouette. Designed with side pockets for function and ease, they strike the perfect balance between practicality and statement style. The clean lines and soft drape make them ideal for both everyday wear and elevated occasions. Pair them with a patterned top for a modern contrast or a simple pattern for a monochrome look that commands attention.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A013',0,1,0,0,NULL,'2026-01-29 12:29:49','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[\"Orange\", \"Dark Red\", \"Grey\"]','[\"L\", \"M\", \"XL\", \"S\"]',0,0,NULL),('d5527268-4c93-4a01-9fd2-bde3a7781178','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:53','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('d6257bf5-9b86-4e32-9e31-8c4e5eb82809','Beige Textured Top with wide sleeves','Beige Textured Top with wide sleeves',NULL,'An elevated staple that blends comfort and grace, this beige top features an abstract pattern subtly inspired by natural textures. The relaxed cut and wide sleeves create gentle movement, adding a refined sense of ease to your look. Whether styled for daytime sophistication or an evening out.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nLinen Crepe','An elevated staple that blends comfort and grace, this beige top features an abstract pattern subtly inspired by natural textures. The relaxed cut and wide sleeves create gentle movement, adding a refined sense of ease to your look. Whether styled for daytime sophistication or an evening out.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nLinen Crepe',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A002',0,1,0,0,NULL,'2026-01-29 12:29:45','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"XL\", \"M\", \"L\", \"S\"]',0,0,NULL),('d775319d-8167-40a8-9a87-670631653255','Untitled Product','Untitled Product',NULL,'Mix &amp; Match and enjoy 10% discount','Mix &amp; Match and enjoy 10% discount',0.00,NULL,'ed5705a3-0a9f-40d1-a8af-446a9661058c',NULL,0,1,0,0,NULL,'2026-01-29 12:29:50','2026-01-29 12:30:18',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[]',0,0,NULL),('dc7ae370-c7ca-4c17-b88b-98305b67511b','Satin Base Skirt with Printed skirt Overlay','Satin Base Skirt with Printed skirt Overlay',NULL,'This striking skirt combines two contrasting elements in one┬áfluid design. The base is a silky fuchsia or blue satin skirt that┬áadds richness and depth, while the wrap-around top layer┬áprints in fuchsia and blue. Tied delicately at the waist, the┬áoverlay moves gracefully with every step, bringing volume┬áand visual intrigue. Perfect for occasions where you want to┬álook bold, artistic, and effortlessly elegant.\r\n\\n\r\n\\nFabric: satin','This striking skirt combines two contrasting elements in one┬áfluid design. The base is a silky fuchsia or blue satin skirt that┬áadds richness and depth, while the wrap-around top layer┬áprints in fuchsia and blue. Tied delicately at the waist, the┬áoverlay moves gracefully with every step, bringing volume┬áand visual intrigue. Perfect for occasions where you want to┬álook bold, artistic, and effortlessly elegant.\r\n\\n\r\n\\nFabric: satin',0.00,NULL,'ecdfa51a-1c2e-4822-85a4-43205b7eddd4','S010',0,1,0,0,NULL,'2026-01-29 12:29:42','2026-01-29 12:30:19',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[\"Blue\", \"Pink\"]','[\"S\", \"L\", \"XL\", \"M\"]',0,0,NULL),('dec3f433-8f76-47ad-9498-965e17b21cc4','Wide-Leg Trousers with Layered Leaf Wrap','Wide-Leg Trousers with Layered Leaf Wrap',NULL,'These wide-leg trousers redefine modest elegance with their fluid beige base and a beautifully layered leaf-patterned wrap. Designed to add depth and movement, the wrap creates a subtle contrast while maintaining a cohesive, sophisticated look. Perfect for both daytime chic and evening refinement, this piece blends simplicity with distinctive detailing - a reflection of RaziaΓÇÖs signature effortless elegance.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon &amp; Linen Crepe','These wide-leg trousers redefine modest elegance with their fluid beige base and a beautifully layered leaf-patterned wrap. Designed to add depth and movement, the wrap creates a subtle contrast while maintaining a cohesive, sophisticated look. Perfect for both daytime chic and evening refinement, this piece blends simplicity with distinctive detailing - a reflection of RaziaΓÇÖs signature effortless elegance.\r\n\\n\r\n\\n<b>Fabric:</b>\r\n\\nRayon &amp; Linen Crepe',0.00,NULL,'f4d68212-6998-46c8-9940-9276c708958a','A004',0,1,0,0,NULL,'2026-01-29 12:29:46','2026-01-29 12:30:19',NULL,'no_discount',0.00,0.00,0.00,0.00,0.00,'[]','[\"M\", \"S\", \"XL\", \"L\"]',0,0,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promo_code_usage`
--

DROP TABLE IF EXISTS `promo_code_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promo_code_usage` (
  `id` char(36) NOT NULL,
  `promo_code_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `order_id` char(36) DEFAULT NULL,
  `used_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_usage` (`promo_code_id`,`user_id`,`order_id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `promo_code_usage_ibfk_1` FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promo_code_usage_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promo_code_usage`
--

LOCK TABLES `promo_code_usage` WRITE;
/*!40000 ALTER TABLE `promo_code_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `promo_code_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promo_codes`
--

DROP TABLE IF EXISTS `promo_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promo_codes` (
  `id` char(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `minimum_order` decimal(10,2) DEFAULT '0.00',
  `maximum_discount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT '0',
  `starts_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promo_codes`
--

LOCK TABLES `promo_codes` WRITE;
/*!40000 ALTER TABLE `promo_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `promo_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `referrer_id` char(36) NOT NULL,
  `referee_id` char(36) DEFAULT NULL,
  `referee_order_id` char(36) DEFAULT NULL,
  `status` enum('pending','completed','fraud_suspected') DEFAULT 'pending',
  `reward_coupon_code` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `referrer_id` (`referrer_id`),
  KEY `referee_id` (`referee_id`),
  KEY `referee_order_id` (`referee_order_id`),
  CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`referee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `referrals_ibfk_3` FOREIGN KEY (`referee_order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referrals`
--

LOCK TABLES `referrals` WRITE;
/*!40000 ALTER TABLE `referrals` DISABLE KEYS */;
/*!40000 ALTER TABLE `referrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refund_requests`
--

DROP TABLE IF EXISTS `refund_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refund_requests` (
  `id` varchar(36) NOT NULL,
  `order_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `reason` text NOT NULL,
  `pickup_time` varchar(255) NOT NULL,
  `contact_phone` varchar(50) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_response` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refund_requests_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `refund_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refund_requests`
--

LOCK TABLES `refund_requests` WRITE;
/*!40000 ALTER TABLE `refund_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `refund_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `product_id` char(36) NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `is_verified_purchase` tinyint(1) DEFAULT '0',
  `is_approved` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_review` (`user_id`,`product_id`),
  KEY `idx_reviews_product` (`product_id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_outfit_items`
--

DROP TABLE IF EXISTS `saved_outfit_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_outfit_items` (
  `id` char(36) NOT NULL,
  `outfit_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `position` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_outfit_item` (`outfit_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `saved_outfit_items_ibfk_1` FOREIGN KEY (`outfit_id`) REFERENCES `saved_outfits` (`id`) ON DELETE CASCADE,
  CONSTRAINT `saved_outfit_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_outfit_items`
--

LOCK TABLES `saved_outfit_items` WRITE;
/*!40000 ALTER TABLE `saved_outfit_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_outfit_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_outfits`
--

DROP TABLE IF EXISTS `saved_outfits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_outfits` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `is_public` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_outfits`
--

LOCK TABLES `saved_outfits` WRITE;
/*!40000 ALTER TABLE `saved_outfits` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_outfits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_config`
--

DROP TABLE IF EXISTS `store_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `config_key` varchar(100) NOT NULL,
  `config_value` json NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key` (`config_key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_config`
--

LOCK TABLES `store_config` WRITE;
/*!40000 ALTER TABLE `store_config` DISABLE KEYS */;
INSERT INTO `store_config` VALUES (1,'outfit_builder_discounts','{\"tier_2\": 15, \"tier_3\": 20, \"tier_4\": 25, \"tier_5\": 30}','2026-01-25 19:10:09');
/*!40000 ALTER TABLE `store_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `avatar_url` text,
  `phone` varchar(50) DEFAULT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `google_id` varchar(255) DEFAULT NULL,
  `profile_pic` text,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `personal_referral_code` varchar(20) DEFAULT NULL,
  `wishlist` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `personal_referral_code` (`personal_referral_code`),
  KEY `idx_referral_code` (`personal_referral_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0b717c22-fa1a-11f0-80c2-ae9b26e7caa3','testuser_1769365020492@example.com','$2a$10$7v12nGtDS7ie.d1ef.TtLOnesAd2EUn1Ozglt1iGudgtTJArrPkQu','Test','User',NULL,NULL,'customer',0,'2026-01-25 18:17:01','2026-01-25 18:17:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('0e5fea0e-f5da-11f0-ac31-fee8668bd513','helmymhelmy22@gmail.com',NULL,'helmy','mohammed',NULL,NULL,'customer',0,'2026-01-20 08:28:54','2026-01-20 08:28:54','116697973644582300792','https://lh3.googleusercontent.com/a/ACg8ocIDigCKtfuWWABvyywDhvZGkq2x5cOwU71sZYHoCsOBAISLEQ=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('1f8ca3e8-f9d9-11f0-bb17-f25ea2e8687c','testuser_1769337135489@example.com','$2a$10$zlkGJycrII9T852kgZllGuzYV.ktQJf4DF2jzJ2uTdesmA4TKWJy.','Test','User',NULL,NULL,'customer',0,'2026-01-25 10:32:17','2026-01-25 10:32:17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('2dd82073-fb88-11f0-bc51-86524b96cef6','testuser_1769522273073@example.com','$2a$10$dtz5h32O09Atbnul/8911.cdYApZXWZy5bEtH6PkSUApO4aFwTCba','Test','User',NULL,NULL,'customer',0,'2026-01-27 13:57:55','2026-01-27 13:57:55',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('2edffc56-fa19-11f0-80c2-ae9b26e7caa3','testuser_1769364649596@example.com','$2a$10$Cgw2qGw6rTwpn1esfdfxveOhy4IdraAC8/wBOWn9RJ08DyzS1IU2O','Test','User',NULL,NULL,'customer',0,'2026-01-25 18:10:51','2026-01-25 18:10:51',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('319028f2-fd01-11f0-a8c3-d6c7b7971942','helmymo1994@gmail.com','$2a$10$OuKYtlP1tk0cfo/HOx5Swe3zDcP56xbtRxS89dDtfVS78Jrwjdf.a','helmy',' mo',NULL,NULL,'customer',0,'2026-01-29 10:56:41','2026-01-29 13:35:18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[\"c04fe474-67ae-47c6-999d-3d0681360a71\"]'),('5712abe9-f45f-11f0-9ec6-bafe02a6c085','admin@ebazer.com','$2a$10$7V6T7Xpg79UkbfbgAcKU5Ot2wYJ21Y5TpoPMR/EMi8J2bdGcJF/Xi','Admin','User',NULL,NULL,'admin',0,'2026-01-18 11:17:56','2026-01-22 13:08:24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('5712c884-f45f-11f0-9ec6-bafe02a6c085','customer@example.com','$2a$10$ZXUhVPWP42BqFlZHeato/O8ln0PmJaCXQiEcbtJKXrzK5fQLZTHB6','John','Doe',NULL,NULL,'customer',0,'2026-01-18 11:17:56','2026-01-18 11:17:56',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('5712cc09-f45f-11f0-9ec6-bafe02a6c085','admin@example.com','$2a$10$UWx4lN8abie1yG14EcuzZuTDMOdy6r47Hq2W.3j0UzykLkVxlXC72','Start','Admin',NULL,NULL,'admin',0,'2026-01-18 11:17:56','2026-01-26 11:26:52',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('5712ce76-f45f-11f0-9ec6-bafe02a6c085','user@example.com','$2a$10$ZXUhVPWP42BqFlZHeato/O8ln0PmJaCXQiEcbtJKXrzK5fQLZTHB6','Start','User',NULL,NULL,'customer',0,'2026-01-18 11:17:56','2026-01-18 11:17:56',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('64dd00bb-fa19-11f0-80c2-ae9b26e7caa3','testuser_1769364740546@example.com','$2a$10$f9EOjFQzhFqBI8iiz6hpcewJZshMD.TUcWtb0GOhWhD/.aVLUvoPK','Test','User',NULL,NULL,'customer',0,'2026-01-25 18:12:22','2026-01-25 18:12:22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('6747412c-fb88-11f0-bc51-86524b96cef6','testuser_1769522368931@example.com','$2a$10$Guee1//n6ANUSIz6WUUD9OSn94vgw/uWqNfDRv0GDLQUdMBMRIBOm','Test','User',NULL,NULL,'customer',0,'2026-01-27 13:59:31','2026-01-27 13:59:31',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('76658340-faa5-11f0-a484-e6bd1e06c4ba','testuser_1769424900030@example.com','$2a$10$k82Jhneqr4I4BKnMBDKUVuHu3GhzM6wZLopMxR/X0larVXDgE9DjO','Test','User',NULL,NULL,'customer',0,'2026-01-26 10:55:01','2026-01-26 10:55:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('8bbf3ff8-f553-11f0-b4a3-0e755bccd232','helmym8hamed6662@gmail.com',NULL,'Helmy','Mohamed',NULL,NULL,'customer',0,'2026-01-19 16:26:02','2026-01-27 11:33:00','106400962176676332550','https://lh3.googleusercontent.com/a/ACg8ocKo2oNCBpMEvFp0QlQ2AtqwXd2Bgc8CJKujRJ8RUU4Rk8o_asY=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,'[\"0c5870cd-1797-4362-a346-78b963326edd\"]'),('98a352b8-fa1a-11f0-80c2-ae9b26e7caa3','crash_test_1769365245124@example.com','$2a$10$g3gO4nZxIE6ut3VM8NZ22egV3Am66zqvBNGYfxU.bldZlgofigePm','Crash','Test',NULL,NULL,'customer',0,'2026-01-25 18:20:58','2026-01-25 18:20:58',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('99e3a4b4-f464-11f0-9ec6-bafe02a6c085','fatmamokhtar859@gmail.com',NULL,'Meta','Tech',NULL,NULL,'customer',0,'2026-01-18 11:55:36','2026-01-24 12:16:23','107777327592619199703','https://lh3.googleusercontent.com/a/ACg8ocIVEr1dJOVWOWFgGqH3AM_foej7SNsmH6C-DT20ktoxu6bFxoM=s96-c',NULL,NULL,NULL,NULL,NULL,NULL,'[\"57d12c59-f45f-11f0-9ec6-bafe02a6c085\", \"57b92e21-f45f-11f0-9ec6-bafe02a6c085\", \"57f943e9-f45f-11f0-9ec6-bafe02a6c085\"]'),('9ca77930-f45f-11f0-9ec6-bafe02a6c085','kmvbiprq0q83@example.com','$2a$10$o6AMsrEaYyjVFHlSJodQ4eIsa8ploD./w5LEl6.jUUeEV.QhlEgkC','Test','User',NULL,NULL,'customer',0,'2026-01-18 11:19:53','2026-01-18 11:19:53',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('b02e6f0a-faa6-11f0-a484-e6bd1e06c4ba','test_1769425427068@example.com','$2a$10$W0oqUvtlTgADQVRotMWDh.gmpgCrncuHdckS2P4wKZLxC6PoSXUy2','Test','',NULL,NULL,'customer',0,'2026-01-26 11:03:47','2026-01-26 11:03:47',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('cc405efb-fb87-11f0-bc51-86524b96cef6','testuser_1769522108811@example.com','$2a$10$743lvbMx22ZyRdpMY8iN7u7cWBZruFY0pU2McYQnJo9F2uLCA3LS6','Test','User',NULL,NULL,'customer',0,'2026-01-27 13:55:11','2026-01-27 13:55:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('d9bc539e-fa1a-11f0-80c2-ae9b26e7caa3','crash_test_1769365356370@example.com','$2a$10$wimP6Av8Yj1aG/ApWC8qge9/QoobVU0kr1GjYeNsKP3sSn4ZPHCI6','Crash','Test',NULL,NULL,'customer',0,'2026-01-25 18:22:47','2026-01-25 18:22:47',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wishlist` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_wishlists_user` (`user_id`),
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-30  1:59:44
