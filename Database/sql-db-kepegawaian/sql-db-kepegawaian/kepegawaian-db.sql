-- ========================================================
-- DATABASE DUMP TEMPLATE FOR db_kepegawaian
-- Generated: 2026-08-12T10:57:43.749Z
-- ========================================================

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` mediumtext,
  `ua` varchar(256) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `url` text,
  `browser` varchar(64) DEFAULT NULL,
  `platform` varchar(64) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `details` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `activities`
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (1, 'User superadmin berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:01:33', '2026-08-12 17:01:33');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (2, 'User superadmin logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:02:11', '2026-08-12 17:02:11');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (3, 'User superadmin berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:02:40', '2026-08-12 17:02:40');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (4, 'Menghapus user managerhrd (ID: 2)', 'Aktivitas di modul Hapus User', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/user/2', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:02:55', '2026-08-12 17:02:55');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (5, 'Menghapus user adminhrd (ID: 3)', 'Aktivitas di modul Hapus User', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/user/3', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:03:00', '2026-08-12 17:03:00');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (6, 'User superadmin logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:03:13', '2026-08-12 17:03:13');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (7, 'User superadmin berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:03:36', '2026-08-12 17:03:36');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (8, 'User superadmin logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:03:48', '2026-08-12 17:03:48');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (9, 'User ahmadrizki berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:04:02', '2026-08-12 17:04:02');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (10, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:04:03', '2026-08-12 17:04:03');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (11, 'Memperbarui setting tarif tunjangan transport menjadi Rp 5000', 'Aktivitas di modul Setting Tunjangan', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/tunjangan/setting', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:04:24', '2026-08-12 17:04:24');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (12, 'Melakukan kalkulasi tunjangan transport periode 8/2026', 'Aktivitas di modul Hitung Tunjangan Transport', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/tunjangan/hitung', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:04:27', '2026-08-12 17:04:27');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (13, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:04:36', '2026-08-12 17:04:36');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (14, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:04:48', '2026-08-12 17:04:48');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (15, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:04:59', '2026-08-12 17:04:59');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (16, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:05:03', '2026-08-12 17:05:03');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (17, 'User ahmadrizki logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:05:06', '2026-08-12 17:05:06');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (18, 'User superadmin berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:46:02', '2026-08-12 17:46:02');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (19, 'User superadmin logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:46:36', '2026-08-12 17:46:36');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (20, 'User superadmin berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:46:54', '2026-08-12 17:46:54');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (21, 'User superadmin logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:47:27', '2026-08-12 17:47:27');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (22, 'User ahmadrizki berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:47:39', '2026-08-12 17:47:39');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (23, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:47:43', '2026-08-12 17:47:43');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (24, 'Kalkulasi tunjangan transport periode 8/2026 selesai', 'Aktivitas di modul Hitung Tunjangan Transport', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/tunjangan/hitung', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:48:03', '2026-08-12 17:48:03');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (25, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:48:11', '2026-08-12 17:48:11');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (26, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:49:09', '2026-08-12 17:49:09');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (27, 'User ahmadrizki logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:49:22', '2026-08-12 17:49:22');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (28, 'User superadmin berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:49:44', '2026-08-12 17:49:44');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (29, 'Ubah status user sitiaminah menjadi Nonaktif', 'Aktivitas di modul Ubah Status User', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/user/4', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:50:20', '2026-08-12 17:50:20');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (30, 'Ubah status user sitiaminah menjadi Aktif', 'Aktivitas di modul Ubah Status User', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/user/4', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:50:24', '2026-08-12 17:50:24');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (31, 'Ubah status user sitiaminah menjadi Nonaktif', 'Aktivitas di modul Ubah Status User', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/user/4', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:50:27', '2026-08-12 17:50:27');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (32, 'User superadmin logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:50:39', '2026-08-12 17:50:39');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (33, 'User ahmadrizki berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:50:52', '2026-08-12 17:50:52');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (34, 'Kalkulasi tunjangan transport periode 8/2026 selesai', 'Aktivitas di modul Hitung Tunjangan Transport', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/tunjangan/hitung', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:50:58', '2026-08-12 17:50:58');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (35, 'Melihat daftar pegawai page 1', 'Aktivitas di modul View Data Pegawai', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/pegawai', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:51:03', '2026-08-12 17:51:03');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (36, 'User ahmadrizki logout dari aplikasi', 'Aktivitas di modul Logout System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/logout', NULL, NULL, NULL, NULL, NULL, 5, NULL, '2026-08-12 17:51:06', '2026-08-12 17:51:06');
INSERT INTO `activities` (`id`, `title`, `content`, `ua`, `ip`, `url`, `browser`, `platform`, `action`, `details`, `ip_address`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES (37, 'User superadmin berhasil login', 'Aktivitas di modul Login System', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '::1', '/api/auth/login', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-08-12 17:51:25', '2026-08-12 17:51:25');

DROP TABLE IF EXISTS `master_data`;
CREATE TABLE `master_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipe` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `master_data`
INSERT INTO `master_data` (`id`, `tipe`, `nama`) VALUES (1, 'jabatan', 'Manager HRD');
INSERT INTO `master_data` (`id`, `tipe`, `nama`) VALUES (2, 'jabatan', 'Staff HRD');
INSERT INTO `master_data` (`id`, `tipe`, `nama`) VALUES (3, 'jabatan', 'Software Engineer');
INSERT INTO `master_data` (`id`, `tipe`, `nama`) VALUES (4, 'jabatan', 'UI/UX Designer');
INSERT INTO `master_data` (`id`, `tipe`, `nama`) VALUES (5, 'departemen', 'Human Resource');
INSERT INTO `master_data` (`id`, `tipe`, `nama`) VALUES (6, 'departemen', 'Technology');
INSERT INTO `master_data` (`id`, `tipe`, `nama`) VALUES (7, 'departemen', 'Finance');

DROP TABLE IF EXISTS `master_wilayah`;
CREATE TABLE `master_wilayah` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provinsi` varchar(100) NOT NULL,
  `kabupaten` varchar(100) NOT NULL,
  `kecamatan` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `master_wilayah`
INSERT INTO `master_wilayah` (`id`, `provinsi`, `kabupaten`, `kecamatan`) VALUES (1, 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru');
INSERT INTO `master_wilayah` (`id`, `provinsi`, `kabupaten`, `kecamatan`) VALUES (2, 'DKI Jakarta', 'Jakarta Selatan', 'Cilandak');
INSERT INTO `master_wilayah` (`id`, `provinsi`, `kabupaten`, `kecamatan`) VALUES (3, 'D.I. Yogyakarta', 'Sleman', 'Depok');
INSERT INTO `master_wilayah` (`id`, `provinsi`, `kabupaten`, `kecamatan`) VALUES (4, 'Jawa Barat', 'Bandung', 'Coblong');

DROP TABLE IF EXISTS `pegawai`;
CREATE TABLE `pegawai` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nip` varchar(50) NOT NULL,
  `nama_pegawai` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nomor_hp` varchar(30) NOT NULL,
  `tempat_lahir` varchar(100) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `id_kecamatan` int DEFAULT NULL,
  `alamat_lengkap` text,
  `jarak_rumah_kantor` decimal(5,2) DEFAULT '0.00',
  `status_kawin` varchar(30) DEFAULT 'tidak kawin',
  `jumlah_anak` int DEFAULT '0',
  `tanggal_masuk` date NOT NULL,
  `id_jabatan` int DEFAULT NULL,
  `id_departemen` int DEFAULT NULL,
  `status_kontrak` varchar(30) DEFAULT 'PKWTT',
  `jenis_kelamin` varchar(20) DEFAULT 'Laki-laki',
  `usia` int DEFAULT '0',
  `status` varchar(20) DEFAULT 'Aktif',
  `foto_pegawai` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nip` (`nip`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `pegawai`
INSERT INTO `pegawai` (`id`, `nip`, `nama_pegawai`, `email`, `nomor_hp`, `tempat_lahir`, `tanggal_lahir`, `id_kecamatan`, `alamat_lengkap`, `jarak_rumah_kantor`, `status_kawin`, `jumlah_anak`, `tanggal_masuk`, `id_jabatan`, `id_departemen`, `status_kontrak`, `jenis_kelamin`, `usia`, `status`, `foto_pegawai`, `created_at`, `updated_at`) VALUES (1, '198501012010011001', 'Budi Santoso', 'budi.santoso@company.com', '+6281234567890', 'Jakarta', '1985-01-01', 1, 'Jl. Sudirman No. 123', '10.50', 'kawin', 2, '2010-01-01', 1, 5, 'PKWTT', 'Laki-laki', 39, 'Aktif', NULL, '2026-08-12 16:41:39', '2026-08-12 16:41:39');
INSERT INTO `pegawai` (`id`, `nip`, `nama_pegawai`, `email`, `nomor_hp`, `tempat_lahir`, `tanggal_lahir`, `id_kecamatan`, `alamat_lengkap`, `jarak_rumah_kantor`, `status_kawin`, `jumlah_anak`, `tanggal_masuk`, `id_jabatan`, `id_departemen`, `status_kontrak`, `jenis_kelamin`, `usia`, `status`, `foto_pegawai`, `created_at`, `updated_at`) VALUES (2, '199002022015022002', 'Siti Aminah', 'siti.aminah@company.com', '+6281298765432', 'Bandung', '1990-02-02', 4, 'Jl. Dago No. 45', '8.00', 'kawin', 1, '2015-02-01', 2, 5, 'PKWTT', 'Perempuan', 34, 'Nonaktif', NULL, '2026-08-12 16:41:39', '2026-08-12 17:52:19');
INSERT INTO `pegawai` (`id`, `nip`, `nama_pegawai`, `email`, `nomor_hp`, `tempat_lahir`, `tanggal_lahir`, `id_kecamatan`, `alamat_lengkap`, `jarak_rumah_kantor`, `status_kawin`, `jumlah_anak`, `tanggal_masuk`, `id_jabatan`, `id_departemen`, `status_kontrak`, `jenis_kelamin`, `usia`, `status`, `foto_pegawai`, `created_at`, `updated_at`) VALUES (3, '199503032020031003', 'Ahmad Rizki', 'ahmad.rizki@company.com', '+6281311223344', 'Yogyakarta', '1995-03-03', 3, 'Jl. Kaliurang Km 5', '15.20', 'tidak kawin', 0, '2020-03-01', 3, 6, 'PKWTT', 'Laki-laki', 29, 'Aktif', NULL, '2026-08-12 16:41:39', '2026-08-12 16:41:39');

DROP TABLE IF EXISTS `pegawai_pendidikan`;
CREATE TABLE `pegawai_pendidikan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pegawai` int NOT NULL,
  `tingkat_pendidikan` varchar(50) NOT NULL,
  `nama_sekolah` varchar(150) NOT NULL,
  `tahun_lulus` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `pegawai_pendidikan`
INSERT INTO `pegawai_pendidikan` (`id`, `id_pegawai`, `tingkat_pendidikan`, `nama_sekolah`, `tahun_lulus`) VALUES (1, 1, 'S1', 'Universitas Indonesia', 2008);
INSERT INTO `pegawai_pendidikan` (`id`, `id_pegawai`, `tingkat_pendidikan`, `nama_sekolah`, `tahun_lulus`) VALUES (2, 2, 'S1', 'Universitas Padjadjaran', 2012);
INSERT INTO `pegawai_pendidikan` (`id`, `id_pegawai`, `tingkat_pendidikan`, `nama_sekolah`, `tahun_lulus`) VALUES (3, 3, 'S1', 'Universitas Gadjah Mada', 2017);

DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_role` smallint DEFAULT NULL,
  `modul_fitur` varchar(100) DEFAULT NULL,
  `akses` tinyint(1) DEFAULT '0',
  `create` tinyint(1) DEFAULT '0',
  `read` enum('All','Own','No') DEFAULT 'No',
  `update` enum('All','Own','No') DEFAULT 'No',
  `delete` enum('All','Own','No') DEFAULT 'No',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `role_permission`
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (1, 1, 'Login/Logout', 1, 1, 'All', 'All', 'All');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (2, 1, 'Kelola Role', 1, 0, 'All', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (3, 1, 'Kelola User', 1, 1, 'All', 'All', 'All');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (4, 1, 'My Profile', 1, 0, 'Own', 'Own', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (5, 1, 'Dashboard', 1, 0, 'All', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (6, 1, 'Data Pegawai', 0, 0, 'No', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (7, 1, 'Tunjangan Transport', 0, 0, 'No', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (8, 1, 'Setting Tunjangan', 0, 0, 'No', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (9, 1, 'Activity Log', 1, 0, 'All', 'No', 'No');

INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (10, 2, 'Login/Logout', 1, 1, 'All', 'All', 'All');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (11, 2, 'Kelola Role', 0, 0, 'No', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (12, 2, 'Kelola User', 0, 0, 'No', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (13, 2, 'My Profile', 1, 0, 'Own', 'Own', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (14, 2, 'Dashboard', 1, 0, 'All', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (15, 2, 'Data Pegawai', 1, 0, 'All', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (16, 2, 'Tunjangan Transport', 1, 0, 'All', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (17, 2, 'Setting Tunjangan', 0, 0, 'No', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (18, 2, 'Activity Log', 0, 0, 'No', 'No', 'No');

INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (19, 3, 'Login/Logout', 1, 1, 'All', 'All', 'All');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (20, 3, 'Kelola Role', 0, 0, 'No', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (21, 3, 'Kelola User', 0, 0, 'No', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (22, 3, 'My Profile', 1, 0, 'Own', 'Own', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (23, 3, 'Dashboard', 1, 0, 'All', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (24, 3, 'Data Pegawai', 1, 1, 'All', 'All', 'All');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (25, 3, 'Tunjangan Transport', 1, 0, 'All', 'No', 'No');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (26, 3, 'Setting Tunjangan', 1, 1, 'All', 'All', 'All');
INSERT INTO `role_permission` (`id`, `id_role`, `modul_fitur`, `akses`, `create`, `read`, `update`, `delete`) VALUES (27, 3, 'Activity Log', 0, 0, 'No', 'No', 'No');

DROP TABLE IF EXISTS `setting_tunjangan_transport`;
CREATE TABLE `setting_tunjangan_transport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tarif_per_km` decimal(10,2) NOT NULL DEFAULT '5000.00',
  `berlaku_mulai` date NOT NULL,
  `min_km` int DEFAULT '5',
  `max_km` int DEFAULT '25',
  `min_hari_masuk` int DEFAULT '19',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `setting_tunjangan_transport`
INSERT INTO `setting_tunjangan_transport` (`id`, `tarif_per_km`, `berlaku_mulai`, `min_km`, `max_km`, `min_hari_masuk`, `created_at`) VALUES (1, '5000.00', '2026-01-01', 5, 25, 19, '2026-08-12 16:41:39');

DROP TABLE IF EXISTS `total_masuk_pegawai`;
CREATE TABLE `total_masuk_pegawai` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pegawai` int NOT NULL,
  `bulan` tinyint NOT NULL,
  `tahun` smallint NOT NULL,
  `total_masuk` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pegawai_bulan_tahun` (`id_pegawai`,`bulan`,`tahun`),
  CONSTRAINT `fk_total_masuk_pegawai` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data for `total_masuk_pegawai`
INSERT INTO `total_masuk_pegawai` (`id`, `id_pegawai`, `bulan`, `tahun`, `total_masuk`, `created_at`, `updated_at`) VALUES (1, 1, 8, 2026, 22, '2026-08-12 17:56:37', '2026-08-12 18:20:50');
INSERT INTO `total_masuk_pegawai` (`id`, `id_pegawai`, `bulan`, `tahun`, `total_masuk`, `created_at`, `updated_at`) VALUES (2, 3, 8, 2026, 22, '2026-08-12 17:56:37', '2026-08-12 17:56:37');
INSERT INTO `total_masuk_pegawai` (`id`, `id_pegawai`, `bulan`, `tahun`, `total_masuk`, `created_at`, `updated_at`) VALUES (3, 5, 8, 2026, 22, '2026-08-12 18:23:08', '2026-08-12 18:23:08');

DROP TABLE IF EXISTS `tunjangan_transport`;
CREATE TABLE `tunjangan_transport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bulan` int NOT NULL,
  `tahun` int NOT NULL,
  `total_penerima` int DEFAULT '0',
  `total_nominal` decimal(15,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `tunjangan_transport`
INSERT INTO `tunjangan_transport` (`id`, `bulan`, `tahun`, `total_penerima`, `total_nominal`, `created_at`, `updated_at`) VALUES (1, 8, 2026, 3, '5390000.00', '2026-08-12 18:59:27', '2026-08-12 18:59:27');

DROP TABLE IF EXISTS `tunjangan_transport_detail`;
CREATE TABLE `tunjangan_transport_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_tunjangan_transport` int NOT NULL,
  `id_pegawai` int NOT NULL,
  `jarak_km` int NOT NULL,
  `jumlah_hari` int NOT NULL,
  `nominal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `tunjangan_transport_detail`
INSERT INTO `tunjangan_transport_detail` (`id`, `id_tunjangan_transport`, `id_pegawai`, `jarak_km`, `jumlah_hari`, `nominal`) VALUES (1, 1, 1, 11, 22, '1210000.00');
INSERT INTO `tunjangan_transport_detail` (`id`, `id_tunjangan_transport`, `id_pegawai`, `jarak_km`, `jumlah_hari`, `nominal`) VALUES (2, 1, 3, 15, 22, '1650000.00');
INSERT INTO `tunjangan_transport_detail` (`id`, `id_tunjangan_transport`, `id_pegawai`, `jarak_km`, `jumlah_hari`, `nominal`) VALUES (3, 1, 5, 23, 22, '2530000.00');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nomor_hp` varchar(30) DEFAULT NULL,
  `id_role` int NOT NULL,
  `id_pegawai` int DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `user`
INSERT INTO `user` (`id`, `username`, `password_hash`, `nama`, `email`, `nomor_hp`, `id_role`, `id_pegawai`, `disabled`, `last_login`, `created_at`, `updated_at`) VALUES (1, 'superadmin', '$2b$10$oUZ.iFzaUbTZBmIMErPZ1Of5HnQkCIRuSghA.5WWSOLqD4yYYcdma', 'Superadmin', 'superadmin@company.com', '+628110000001', 1, NULL, 0, '2026-08-12 17:51:25', '2026-08-12 16:41:39', '2026-08-12 17:51:25');
INSERT INTO `user` (`id`, `username`, `password_hash`, `nama`, `email`, `nomor_hp`, `id_role`, `id_pegawai`, `disabled`, `last_login`, `created_at`, `updated_at`) VALUES (4, 'sitiaminah', '$2b$10$oUZ.iFzaUbTZBmIMErPZ1Of5HnQkCIRuSghA.5WWSOLqD4yYYcdma', 'Siti Aminah', NULL, NULL, 2, 2, 0, NULL, '2026-08-12 16:56:02', '2026-08-12 17:50:27');
INSERT INTO `user` (`id`, `username`, `password_hash`, `nama`, `email`, `nomor_hp`, `id_role`, `id_pegawai`, `disabled`, `last_login`, `created_at`, `updated_at`) VALUES (5, 'ahmadrizki', '$2b$10$oUZ.iFzaUbTZBmIMErPZ1Of5HnQkCIRuSghA.5WWSOLqD4yYYcdma', 'Ahmad Rizki', NULL, NULL, 3, 3, 0, '2026-08-12 17:50:52', '2026-08-12 16:57:57', '2026-08-12 17:50:52');

DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_role` varchar(50) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama_role` (`nama_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for `user_role`
INSERT INTO `user_role` (`id`, `nama_role`, `deskripsi`) VALUES (1, 'Superadmin', 'Mengelola sistem, user, role, dan log.');
INSERT INTO `user_role` (`id`, `nama_role`, `deskripsi`) VALUES (2, 'Manager HRD', 'Mengakses informasi kepegawaian dan tunjangan.');
INSERT INTO `user_role` (`id`, `nama_role`, `deskripsi`) VALUES (3, 'Admin HRD', 'Mengelola data pegawai dan administrasi HRD.');

SET FOREIGN_KEY_CHECKS=1;
