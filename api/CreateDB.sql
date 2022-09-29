CREATE DATABASE CYGNUSAIRCRAFT;

use CYGNUSAIRCRAFT;

CREATE TABLE USER (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(20) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dt_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_last_access DATETIME
);

CREATE TABLE AIRCRAFT (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50),
    series VARCHAR(255),
    company_id BIGINT,
    engine VARCHAR(255),
    max_takeoff_weight VARCHAR(255),
    first_year_production VARCHAR(255),
    tbo VARCHAR(255),
    max_capacity VARCHAR(10),
    max_cruise_speed VARCHAR(255),
    max_range VARCHAR(255),
    max_operating_altitude VARCHAR(255),
    wingspan VARCHAR(255),
    length VARCHAR(255),
    height VARCHAR(255),
    max_tail_height VARCHAR(255),
    min_takeoff_distance VARCHAR(255),
    description TEXT,
    description_en TEXT,
    photos_path VARCHAR(255),
    model_order INT
);

CREATE AVAILABLE_AIRCRAFT(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50),
    series VARCHAR(255),
    company_id BIGINT,
    available TINYINT,
    interior_description TEXT,
    exterior_description TEXT,
    additional_equipment TEXT,
    airframe TEXT,
    engines TEXT,
    propeller TEXT,
    maintance_inspection TEXT,
    avionics TEXT
)

CREATE TABLE COMPANY (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    photo_path VARCHAR(255)
);