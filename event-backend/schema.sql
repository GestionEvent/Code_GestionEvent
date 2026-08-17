-- Schema MySQL pour GestionEvent (alpha)
-- Reprend les entites deja manipulees par le frontend :
--   events (CreateEvent/Events/EventDetails/Dashboard)
--   event_speakers (intervenants saisis a la creation d'un evenement)
--   speakers (annuaire independant, page Speakers)
--   participants (page Participants)
--   users (Login)

CREATE DATABASE IF NOT EXISTS gestion_event
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestion_event;

-- ---------------------------------------------------------------
-- Utilisateurs (auth minimale)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- Evenements
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  category      VARCHAR(100) DEFAULT 'Général',
  event_date    DATE NOT NULL,
  start_time    VARCHAR(20),
  end_time      VARCHAR(20),
  location      VARCHAR(200),
  venue         VARCHAR(200),
  capacity      INT NOT NULL DEFAULT 0,
  ticket_price  DECIMAL(10,2) NOT NULL DEFAULT 0,
  status        ENUM('Actif', 'Brouillon', 'Terminé', 'Annulé') NOT NULL DEFAULT 'Actif',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Intervenants saisis directement lors de la creation d'un evenement
-- (distincts de l'annuaire "speakers" ci-dessous : c'est ainsi que le
-- frontend actuel les traite, voir CreateEvent.jsx)
CREATE TABLE IF NOT EXISTS event_speakers (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  event_id  INT NOT NULL,
  name      VARCHAR(150) NOT NULL,
  role      VARCHAR(150),
  bio       TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Annuaire des intervenants (page Speakers)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS speakers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  role       VARCHAR(150),
  company    VARCHAR(150),
  email      VARCHAR(190),
  bio        TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- Participants
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participants (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  event_id     INT NOT NULL,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(190) NOT NULL,
  reg_status   ENUM('Confirmé', 'En attente', 'Annulé') NOT NULL DEFAULT 'Confirmé',
  attendance   ENUM('Présent', 'Absent', 'En attente') NOT NULL DEFAULT 'En attente',
  ticket_code  VARCHAR(30) NOT NULL UNIQUE,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
