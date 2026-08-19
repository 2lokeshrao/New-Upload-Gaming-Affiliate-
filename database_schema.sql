-- ==============================================================================
-- MySQL Database Structure for BonusPromoCode (Gaming Affiliate Portal)
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: global_config
-- Stores general settings for the website.
-- --------------------------------------------------------
CREATE TABLE `global_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hero_headline` varchar(255) NOT NULL,
  `hero_subheading` varchar(255) NOT NULL,
  `top_banner_template` text,
  `enable_sub_partner_program` tinyint(1) DEFAULT 0,
  `sub_partner_headline` varchar(255) DEFAULT NULL,
  `copyright_text` varchar(255) DEFAULT NULL,
  `footer_disclaimer_text` text,
  `telegram_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `tiktok_url` varchar(255) DEFAULT NULL,
  `whatsapp_group_url` varchar(255) DEFAULT NULL,
  `youtube_url` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: platforms (Gaming Brands)
-- --------------------------------------------------------
CREATE TABLE `platforms` (
  `id` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `star_rating` int(11) DEFAULT 5,
  `bonus_text` varchar(255) DEFAULT NULL,
  `promo_code` varchar(50) DEFAULT NULL,
  `raw_affiliate_url` varchar(500) NOT NULL,
  `master_partner_url` varchar(500) DEFAULT NULL,
  `claim_url` varchar(500) DEFAULT NULL,
  `review_content` longtext,
  `is_featured` tinyint(1) DEFAULT 0,
  `featured_rank` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `clicks_count` int(11) DEFAULT 0,
  `copies_count` int(11) DEFAULT 0,
  `category` varchar(100) DEFAULT NULL,
  `bonus_title` varchar(255) DEFAULT NULL,
  `min_deposit` varchar(100) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` text,
  `average_user_rating` decimal(3,1) DEFAULT NULL,
  `total_reviews_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: articles (AI Articles & Blog Posts)
-- --------------------------------------------------------
CREATE TABLE `articles` (
  `id` varchar(100) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `category` varchar(100) NOT NULL,
  `platform_id` varchar(100) DEFAULT NULL,
  `platform_name` varchar(100) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `cover_image` varchar(255) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `status` enum('draft','published') DEFAULT 'published',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `platform_id` (`platform_id`),
  CONSTRAINT `fk_article_platform` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: custom_pages
-- --------------------------------------------------------
CREATE TABLE `custom_pages` (
  `id` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: sub_partners (Affiliate Applications)
-- --------------------------------------------------------
CREATE TABLE `sub_partners` (
  `id` varchar(100) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `whatsapp` varchar(50) NOT NULL,
  `platform_id` varchar(100) NOT NULL,
  `platform_name` varchar(100) NOT NULL,
  `traffic_source` varchar(255) DEFAULT NULL,
  `estimated_monthly_players` varchar(100) DEFAULT NULL,
  `status` enum('pending','approved','contacted') DEFAULT 'pending',
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: track_logs (Click and Visit Tracking)
-- --------------------------------------------------------
CREATE TABLE `track_logs` (
  `id` varchar(100) NOT NULL,
  `platform_id` varchar(100) DEFAULT NULL,
  `platform_name` varchar(100) DEFAULT NULL,
  `event_type` enum('visit','click','copy') NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `user_agent` text,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `platform_id` (`platform_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: mysql_state_store (Hybrid JSON Storage)
-- This table is used by the app to persist the entire JSON state safely.
-- --------------------------------------------------------
CREATE TABLE `mysql_state_store` (
  `id` int(11) NOT NULL DEFAULT 1,
  `state_json` longtext NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
