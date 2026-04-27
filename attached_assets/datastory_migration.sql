-- ============================================================
-- DATASTORY — Script de migration MySQL propre
-- Généré pour déploiement VPS
-- Schéma nettoyé : SSO supprimé, rôles simplifiés (3 niveaux)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TABLE: Company (marques clientes)
-- ============================================================
DROP TABLE IF EXISTS `Company`;
CREATE TABLE `Company` (
  `id`                    VARCHAR(36)   NOT NULL,
  `name`                  VARCHAR(255)  NOT NULL DEFAULT '',
  `slug`                  VARCHAR(255)  NOT NULL DEFAULT '',
  `domain`                VARCHAR(255)  NOT NULL DEFAULT '',
  `has_franchise`         TINYINT(1)    NOT NULL DEFAULT 0,
  `logo_url`              VARCHAR(512)  DEFAULT NULL COMMENT 'URL publique du logo (CDN ou upload)',
  `font_regular_filename` VARCHAR(255)  DEFAULT NULL COMMENT 'Fichier woff2 police normale',
  `font_bold_filename`    VARCHAR(255)  DEFAULT NULL COMMENT 'Fichier woff2 police grasse',
  `created_at`            DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_slug_uq` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: Franchise (concessions / magasins / stores)
-- ============================================================
DROP TABLE IF EXISTS `Franchise`;
CREATE TABLE `Franchise` (
  `id`         VARCHAR(36)   NOT NULL,
  `name`       VARCHAR(255)  NOT NULL DEFAULT '',
  `company_id` VARCHAR(36)   NOT NULL,
  `code`       VARCHAR(100)  NOT NULL DEFAULT '',
  `address`    VARCHAR(500)  NOT NULL DEFAULT '',
  `zipcode`    VARCHAR(20)   NOT NULL DEFAULT '',
  `created_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `franchise_company_idx` (`company_id`),
  CONSTRAINT `franchise_company_fk`
    FOREIGN KEY (`company_id`) REFERENCES `Company` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: Dashboard (liens Looker Studio)
-- ============================================================
DROP TABLE IF EXISTS `Dashboard`;
CREATE TABLE `Dashboard` (
  `id`          VARCHAR(36)   NOT NULL,
  `name`        VARCHAR(255)  NOT NULL DEFAULT '',
  `company_id`  VARCHAR(36)   NOT NULL,
  `looker_url`  TEXT          NOT NULL,
  `active`      TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `dashboard_company_idx` (`company_id`),
  CONSTRAINT `dashboard_company_fk`
    FOREIGN KEY (`company_id`) REFERENCES `Company` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: Dashboard ↔ Franchise (accès par franchise)
-- ============================================================
DROP TABLE IF EXISTS `DashboardFranchise`;
CREATE TABLE `DashboardFranchise` (
  `dashboard_id`  VARCHAR(36) NOT NULL,
  `franchise_id`  VARCHAR(36) NOT NULL,
  PRIMARY KEY (`dashboard_id`, `franchise_id`),
  KEY `df_franchise_idx` (`franchise_id`),
  CONSTRAINT `df_dashboard_fk`
    FOREIGN KEY (`dashboard_id`) REFERENCES `Dashboard` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `df_franchise_fk`
    FOREIGN KEY (`franchise_id`) REFERENCES `Franchise` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: User
-- Rôles : admin | brand_admin | viewer
-- Un viewer avec franchise_id voit les dashboards de sa franchise
-- Un viewer sans franchise_id voit ses dashboards directs
-- ============================================================
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id`           VARCHAR(36)   NOT NULL,
  `firstname`    VARCHAR(255)  NOT NULL DEFAULT '',
  `lastname`     VARCHAR(255)  NOT NULL DEFAULT '',
  `email`        VARCHAR(255)  NOT NULL DEFAULT '',
  `password`     VARCHAR(255)  DEFAULT NULL COMMENT 'Hash bcrypt',
  `role`         ENUM('admin','brand_admin','viewer') NOT NULL DEFAULT 'viewer',
  `company_id`   VARCHAR(36)   DEFAULT NULL COMMENT 'NULL uniquement pour admin global',
  `franchise_id` VARCHAR(36)   DEFAULT NULL COMMENT 'NULL si user au niveau marque',
  `is_active`    TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_uq` (`email`),
  KEY `user_company_idx` (`company_id`),
  KEY `user_franchise_idx` (`franchise_id`),
  CONSTRAINT `user_company_fk`
    FOREIGN KEY (`company_id`) REFERENCES `Company` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_franchise_fk`
    FOREIGN KEY (`franchise_id`) REFERENCES `Franchise` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: Dashboard ↔ User (accès direct par user)
-- ============================================================
DROP TABLE IF EXISTS `DashboardUser`;
CREATE TABLE `DashboardUser` (
  `dashboard_id` VARCHAR(36) NOT NULL,
  `user_id`      VARCHAR(36) NOT NULL,
  PRIMARY KEY (`dashboard_id`, `user_id`),
  KEY `du_user_idx` (`user_id`),
  CONSTRAINT `du_dashboard_fk`
    FOREIGN KEY (`dashboard_id`) REFERENCES `Dashboard` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `du_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DONNÉES : Companies
-- Note: 'ddb' et 'BBDO' sont des entités internes BBDO Paris
--       à conserver ou supprimer selon votre besoin
-- ============================================================
INSERT INTO `Company` (`id`, `name`, `slug`, `domain`, `has_franchise`) VALUES
('0b935110-f7e6-4d60-8e62-e073fe64c079', 'Prime Video',      'prime-video',  'primevideo',     0),
('3949e1fd-f574-4271-a642-c9ab54c18737', 'EDF',              'edf',          'edf',            0),
('3e43e563-f69e-4573-8285-7283915a662f', 'Audi',             'audi',         'audi',           0),
('583b6953-b97e-41c3-9dd5-70ffc20cb93d', 'McDonald\'s',      'mcdonalds',    'mcdo',           0),
('7319b938-85a2-4094-a419-39c50a78cae8', 'SEAT/CUPRA',       'seatcupra',    'seatcupra',      0),
('79453ad2-06a6-4886-aeb5-0a0e9bcc29ed', 'DDB',              'ddb',          '',               0),
('96b590af-068a-4d0b-a52f-1ce8e27cb672', 'Audi Concessions', 'audi-concessions', 'audi-concessions', 1),
('d6e9b6bb-7f9c-4cca-bc6b-779e78c9a229', 'Samsung',          'samsung',      'samsung',        0),
('ecb3221b-4bd0-4093-8b13-d50c800da80b', 'AAE',              'aae',          'aae',            0),
('fad2a3fe-ad82-47f7-b028-f63beadd6b2c', 'BBDO',             'bbdo',         '',               0);

-- ============================================================
-- DONNÉES : Franchises
-- ============================================================
INSERT INTO `Franchise` (`id`, `name`, `company_id`, `code`, `address`, `zipcode`) VALUES
('6388e598-e6cc-418a-82aa-10374c24b1fd', 'Groupe Jeannin', '96b590af-068a-4d0b-a52f-1ce8e27cb672', '', '', '');

-- ============================================================
-- DONNÉES : Dashboards
-- ============================================================
INSERT INTO `Dashboard` (`id`, `name`, `company_id`, `looker_url`) VALUES
-- Audi Concessions (dealerships individuels)
('094da5d5-32b4-4ac5-89ab-ca5a72e63e3f', 'DB www.audiaubagne.com',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804051076326%22%7D'),
('0b58dcb9-cc14-4c51-b0f0-6d113eee4370', 'DB www.audi-annemasse.fr',                    '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809387699840%22%7D'),
('0cd778c1-689e-4364-96fd-b8cd04cfa72e', 'DB www.audi-mont-de-marsan.com',               '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801516516880%22%7D'),
('178664a2-8e30-48fd-9628-ee10d391f12c', 'DB www.audi-lyonsud.com',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25803661921996%22%7D'),
('178a262f-0ffc-4a36-88e7-5773a1642d16', 'DB www.audiarles.fr',                         '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809354841187%22%7D'),
('17c403f3-425f-4fe0-bd9e-5bf2edc1ff5d', 'DB www.audi-larochesuryon.fr',                '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801328749881%22%7D'),
('1a9180dc-f156-414d-9e4c-82c6f3929524', 'DB www.audi-samoreau.fr',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807147040224%22%7D'),
('1b202651-2100-45ca-ba5a-040db867205d', 'DB www.audi-bymycar-bourgoin-jallieu.fr',      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809285234174%22%7D'),
('1bd49228-4d55-4d08-8b54-7aa977dd5cee', 'DB www.audi-tarbes.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808474343464%22%7D'),
('200513f2-8189-4e0c-a957-f972a52aab36', 'DB www.audi-chalon.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807613121818%22%7D'),
('210408e0-8e9f-4534-bb52-f9fd8e0e9935', 'DB www.audi-nimes.com',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25803921317340%22%7D'),
('2295fabe-5189-4c38-9289-63092f0707d6', 'DB www.audi-pau.fr',                          '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804937245161%22%7D'),
('22c8bb45-b9d5-4f26-9663-4f8be9d7583f', 'DB www.audi-albi.fr',                         '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809121491768%22%7D'),
('249da9b6-b08c-4eda-ab93-6b67c28c0c12', 'DB www.audi-narbonne.com',                    '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806906238912%22%7D'),
('25b2ae2a-e1ae-43f0-a6ab-2ac9de801d90', 'DB www.audi-pamiers.com',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806001420138%22%7D'),
('27d98b9a-3940-436a-87c7-aaeceaa4d665', 'DB www.audi-annecy.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801634360488%22%7D'),
('2cb5e744-3f81-4bcf-a56a-38fde9f3825a', 'DB www.audi-limoges.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25803348324190%22%7D'),
('2dccd09f-be59-4cab-92d8-d1f746914a42', 'DB www.audi-vert-saint-denis.fr',             '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25803969105290%22%7D'),
('31aa0742-db2f-493c-8b4a-0cb71d88faf2', 'DB www.audi-jura.fr',                         '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808657556743%22%7D'),
('33535844-4267-4cc7-86c4-1584cc523df1', 'DB www.audi-vesoul.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801224118379%22%7D'),
('341ede71-7e4e-43b2-a4e5-1755632ffeda', 'DB www.audi-perpignan.com',                   '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801599149407%22%7D'),
('36f33b04-da3a-4263-a17c-2336463c05d3', 'DB www.audi-saintmaur.fr',                    '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804625945337%22%7D'),
('374d4d4d-95fd-460f-b9ed-27f1670d4d8f', 'DB Audi Partenaires',                         '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF'),
('3ca20ab6-3b82-4c48-b7ea-5b5c632501c3', 'DB www.audi-meaux.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806152587296%22%7D'),
('3d262a1d-1e63-4845-a181-113c7220efec', 'DB www.audi-valenciennes.com',                '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807496347946%22%7D'),
('41c0c7b3-6c59-49f4-8170-2f5952f66201', 'DB www.audi-carcassonne.fr',                  '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805863375343%22%7D'),
('43ca9050-8892-41bd-b7a5-4df1b8b7f2c6', 'DB www.audi-aix.com',                         '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807958579229%22%7D'),
('4687fa85-e2a6-45be-a147-faf0c5f1a74b', 'DB www.audi-toulon.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801411173577%22%7D'),
('469d1f69-5319-4989-ab71-a7e774842e7d', 'DB www.audi-belfort.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25802441738510%22%7D'),
('48499f0e-0074-4201-acf0-e63d983f691e', 'DB www.audi-chambery.fr',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805876465743%22%7D'),
('486e134e-5414-455f-a16e-a5f09e3156cf', 'DB www.audi-ravon.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806343868362%22%7D'),
('48e9a551-2c5b-4ea4-8555-f5a7b7aec3b6', 'DB www.audi-castres.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801499250364%22%7D'),
('4ba60960-60e2-4f1c-b9d3-59d485849d55', 'DB www.audi-besancon.fr',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807766918966%22%7D'),
('4c4a4d3e-0a16-404f-b224-ca6d7a782bd2', 'DB www.audi-royan.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806969792094%22%7D'),
('4d8fab31-b22c-40a5-9c09-17ef66bb91f4', 'DB www.audi-rodez.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808162822954%22%7D'),
('4ebbabdb-b74f-4308-9f97-cb03897718a5', 'DB www.audi-espace-saint-maximin.fr',          '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805101379673%22%7D'),
('58530dda-efa3-406b-96c8-1edd9511ef64', 'DB www.audi-bayonne.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809056255043%22%7D'),
('58a35c4e-bdbf-4d18-99e7-791760f960f0', 'DB www.audi-auxerre.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806623942029%22%7D'),
('5988a9d4-f945-48cf-890c-6d7adb6f65da', 'DB www.audi-lesulis.com',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806200437067%22%7D'),
('59911404-f4cc-44b8-b43d-aacb0d88113a', 'DB www.audi-alencon.com',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25803730667013%22%7D'),
('59aba31f-b752-42d3-8c91-fab1bbe22737', 'DB www.audi-cholet.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801214089133%22%7D'),
('5b6f29ed-76bd-47d9-9d2f-833fdc19a257', 'DB www.audidreux.fr',                         '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807688790976%22%7D'),
('5e49467c-b09f-48f7-bc93-2977fe1144f0', 'DB www.audi-brive.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804560941247%22%7D'),
('67e658b1-602b-4eac-846a-0b01cd1a2a2b', 'DB www.audi-laon.fr',                         '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25802561788738%22%7D'),
('690bb543-45f5-4a91-b4e3-6c4f43c431fb', 'DB www.audi-bymycar-orleans.fr',              '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806837028997%22%7D'),
('7013de99-8e97-4516-8bcc-5cbb114ccfd6', 'DB www.audi-chaumont.fr',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805316011379%22%7D'),
('7093c1a4-cbe8-4fd4-86cf-d3c81a30b8a1', 'DB www.audi-saintlo.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805901735542%22%7D'),
('71c5bace-f885-4fe0-ad4d-b38064a90026', 'DB www.audi-angers.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805373066277%22%7D'),
('735483d2-63f4-4e66-bb00-aa78687f0aa0', 'DB www.audi-saintmalo.com',                   '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25802755328642%22%7D'),
('73559334-5569-47ed-aa45-b9cb9c4a8c20', 'DB www.audi-dijon.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806486873269%22%7D'),
('73db0510-0309-484f-8bdb-5b3efb63690a', 'DB www.audi-rouen.com',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809897051127%22%7D'),
('74b68a87-4881-49b2-8b55-7422d1b65eae', 'DB www.audi-montargis.fr',                    '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808897231434%22%7D'),
('74ccabf6-79ca-4ef7-9b9e-bd4be30ed551', 'DB www.audi-le-mans.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806893285184%22%7D'),
('76a86543-6095-4c2b-acf8-fb52ec8b677e', 'DB www.audi-quimper.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808731003085%22%7D'),
('7ace989c-ed39-4460-a059-15ed705966a4', 'DB www.audi-bastia.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807455638262%22%7D'),
('7b55f0ff-12ee-455c-b803-6bda7791cb43', 'DB www.audi-tours.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808807130464%22%7D'),
('7c335a82-11f8-41e3-a09a-ead66fcf807e', 'DB www.audi-saint-victoret.com',              '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807015362034%22%7D'),
('81ad11f9-f8eb-4cab-9e26-9f9dbaa0d46f', 'DB www.audi-vire.fr',                         '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805757630845%22%7D'),
('81af7e91-8ffc-443a-91a2-3e1fec7ad981', 'DB www.audiperigueux.com',                    '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805642381315%22%7D'),
('83d1dc30-dc28-4a96-98f8-ae25b5be1bfa', 'DB www.audi-epinal.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809957525972%22%7D'),
('872a1d9e-9356-45a9-8d02-1485c5e99552', 'DB www.auditoulouse.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808435901849%22%7D'),
('889a4d29-c206-4c53-949d-95f460dc14a2', 'DB www.audi-vannes.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804665502686%22%7D'),
('8901eb2f-8745-4d06-b38e-3f8f7d6e98e8', 'DB www.audimonaco.com',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805342257297%22%7D'),
('8e3d9f61-ff70-48bf-9197-533692ed6d8f', 'DB www.audi-gex.fr',                          '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25803852235073%22%7D'),
('8e8ad616-d2ba-4040-94ca-f52e5fe8693f', 'DB www.audi-macon.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805506804069%22%7D'),
('8f7f8778-a833-418a-bdb2-3e304d1afe24', 'DB www.audi-saintnazaire.fr',                 '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801832014230%22%7D'),
('8fb7c669-0c33-4b02-a1c3-4ab0b56ac258', 'DB www.audi-vichy.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25807875756349%22%7D'),
('969bbd6c-b5e9-476f-ba37-3ad49e51192c', 'DB www.audi-pontarlier.fr',                   '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25802323627557%22%7D'),
('991c623b-a881-4c55-b7a2-f6fc15ab33f2', 'DB www.audi-marseille.fr',                    '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805676065539%22%7D'),
('9b9054d5-9b04-4778-86e3-d84b3d005387', 'DB www.audi-lorient.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806263527866%22%7D'),
('9ec98138-0bdd-4f44-9622-55a3e5b7e743', 'DB www.audi-strasbourg.fr',                   '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804177550397%22%7D'),
('a06f6a46-876c-421f-ba00-ebe6fc59ad77', 'DB www.audi-bymycar-villefranche-sur-saone.fr','96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801788656024%22%7D'),
('a58b0f54-12b3-4267-a6f4-df4c92b6226e', 'DB www.audi-bymycar-saint-priest-en-jarez.fr','96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808576106474%22%7D'),
('a8b0a1ff-3842-49ab-8c5e-a121b1b2443d', 'DB www.audi-nevers.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25802221280664%22%7D'),
('aae691a6-df18-4d05-9974-0b9fc3283a18', 'DB www.audievreux.fr',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805236302954%22%7D'),
('ab37fa20-b8de-4e4a-bf0c-823e99e6b747', 'DB www.audi-valence.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805173821817%22%7D'),
('ac0a8d9c-a4a7-44e1-91a3-180ad8758535', 'DB www.audi-lannion.fr',                      '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806634925554%22%7D'),
('ac9f6a75-6a67-41a1-a095-bf22d4721834', 'DB www.audi-mulhouse.fr',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25803450343686%22%7D'),
('ae64cc53-9838-46fb-a188-4ded528765b6', 'DB www.audi-agen.com',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804452492077%22%7D'),
('b3b99627-7703-461c-8b6e-45b212abe784', 'DB www.audi-bourg.com',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25805110278776%22%7D'),
('ba4ceb42-d9b5-4730-aad3-173ebdbdea54', 'DB www.audi-beauvais.fr',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809251223308%22%7D'),
('bdcef5e8-ee36-43b1-ad2f-b12c95fd76bb', 'DB www.audi-troyes.fr',                       '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801758620442%22%7D'),
('bec015ce-75ad-416c-9505-c69cb130c95b', 'DB www.audi-bymycar-le-coteau.fr',            '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25804481725268%22%7D'),
('c0acbf29-ab68-412b-8fe3-8f7cedbd8e03', 'DB www.audi-briecomterobert.fr',              '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25809012749948%22%7D'),
('c283b2ba-b4d6-4d4c-b79d-fae69e0dbba5', 'DB www.audi-dax.com',                        '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25806071976484%22%7D'),
('c4e7c7c6-de85-4e2e-ae2d-fc90481b5d28', 'DB www.audi-compiegne.fr',                   '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25808045100716%22%7D'),
('c6f02438-4280-4939-a338-c3e6504ea2ff', 'DB www.audi-grenoble.fr',                     '96b590af-068a-4d0b-a52f-1ce8e27cb672', 'https://lookerstudio.google.com/embed/reporting/a7a845a8-68f0-4be3-a028-a7d95b19ac95/page/k0WYF?params=%7B%22df30%22:%22include%25EE%2580%25801%25EE%2580%2580IN%25EE%2580%25801196598914%22%7D'),
-- Audi (marque nationale)
('17552791-7c73-4f88-b309-32cca0bb40bf', 'Exec Summary (mobile)',  '3e43e563-f69e-4573-8285-7283915a662f', 'https://lookerstudio.google.com/embed/reporting/9a8f45aa-83cb-418b-86fa-ef6769a8062b/page/p_uyixiu9ptd'),
('193b79b3-a990-486d-8d6c-d061d439f5c6', 'Audi FR Dashboard 360', '3e43e563-f69e-4573-8285-7283915a662f', 'https://lookerstudio.google.com/embed/reporting/738af869-271e-4fd3-9f88-30b575ad0be8/page/p_3kmspcvpsd'),
('1f9d576a-8059-433f-93d1-b0ccc2b2c937', 'Audi Dashboard 360',    '3e43e563-f69e-4573-8285-7283915a662f', 'https://lookerstudio.google.com/embed/reporting/3417596c-605d-4420-9720-a00023459759/page/p_3kmspcvpsd'),
-- Prime Video
('3e6f55ec-0d73-4516-8cc2-6c4e908e0a26', 'Local performance',      '0b935110-f7e6-4d60-8e62-e073fe64c079', 'https://lookerstudio.google.com/embed/reporting/3417596c-605d-4420-9720-a00023459759/page/p_2ugeb2pkkd'),
('67776bbf-e086-4ec7-b4ea-78ff8b774d07', 'Audience Gravity Map',   '0b935110-f7e6-4d60-8e62-e073fe64c079', 'https://lookerstudio.google.com/embed/reporting/3417596c-605d-4420-9720-a00023459759/page/p_2ugeb2pkkd'),
-- EDF
('79f8e18b-172d-455f-a6f4-3489cb53ef3b', 'DB 360 EDF',             '3949e1fd-f574-4271-a642-c9ab54c18737', 'https://lookerstudio.google.com/embed/reporting/18f60080-f541-417d-92fe-e4976128f491/page/p_jl695j3wld'),
-- McDonald's
('4554c6f2-7637-4c3a-9aab-d8f7b599f3c0', 'Social Media Brand',     '583b6953-b97e-41c3-9dd5-70ffc20cb93d', 'https://lookerstudio.google.com/embed/reporting/35e955d5-5790-4f1f-a71a-dbc42bc7857e/page/p_f8yh0pbv4c'),
('be61491e-357a-4055-9399-9b26c6611dcd', 'CRM Piloté',             '583b6953-b97e-41c3-9dd5-70ffc20cb93d', 'https://lookerstudio.google.com/embed/reporting/5543ed00-cb60-4cb9-9c93-80134e21ba2d/page/p_jp94xz41gd'),
-- SEAT/CUPRA
('c785c954-edc1-4b4c-bdaf-8c5b87559f69', 'SEAT/CUPRA DB360',       '7319b938-85a2-4094-a419-39c50a78cae8', 'https://lookerstudio.google.com/embed/reporting/0834b41c-35fc-45ca-8d9e-07f08e085bb6/page/p_47spe0eyqd'),
-- Samsung
('92d22bde-1f8e-4ee6-8977-7663e994c145', 'Social Media Samsung',   'd6e9b6bb-7f9c-4cca-bc6b-779e78c9a229', 'https://lookerstudio.google.com/embed/reporting/b91c8ad6-94be-4e23-80cd-a5df71078ef2/page/p_f48vzeyp4c'),
-- AAE
('bd87cb63-7e77-4e75-89e7-a0d3a102885b', 'Dashboard 360',          'ecb3221b-4bd0-4093-8b13-d50c800da80b', 'https://lookerstudio.google.com/embed/reporting/a759e203-5d2d-4765-8842-4fada82cd249/page/p_6ifo3u6xzd'),
-- DDB (interne)
('4f1da606-7db5-4fe2-a9fc-a9afd2905080', 'Dashboard 1',            '79453ad2-06a6-4886-aeb5-0a0e9bcc29ed', 'https://lookerstudio.google.com/s/lMgyyccm6es'),
('522dfede-f57b-43ff-ad9c-630bc0895f49', 'Dashboard 2',            '79453ad2-06a6-4886-aeb5-0a0e9bcc29ed', 'https://lookerstudio.google.com/embed/reporting/b110eebe-b8b2-4f11-8bff-ee445b8bf727/page/p_f48vzeyp4c'),
('588c6bb2-cb80-4184-9909-72455c3c303c', 'Dashboard 3',            '79453ad2-06a6-4886-aeb5-0a0e9bcc29ed', 'https://lookerstudio.google.com/embed/reporting/779b589e-b619-4099-8104-adc6c0f5cebe/page/p_tcvukhnw5c'),
('6edc1ac8-03f4-468c-877d-43531369c9e0', '[TEST] SEAT/CUPRA DB360','79453ad2-06a6-4886-aeb5-0a0e9bcc29ed', 'https://lookerstudio.google.com/embed/reporting/0834b41c-35fc-45ca-8d9e-07f08e085bb6?pageID=currentURL');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- NOTE : Les utilisateurs ne sont PAS inclus dans ce script
-- Raisons : mots de passe hachés non portables, emails privés
-- → Recréez les comptes via l'interface admin Datastory
-- → Réassignez ensuite les dashboards aux utilisateurs
-- ============================================================
