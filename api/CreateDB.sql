CREATE DATABASE CYGNUSAIRCRAFT;

use CYGNUSAIRCRAFT;

CREATE TABLE USER (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(20) NOT NULL,
    password VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dt_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_last_access DATETIME
);

CREATE TABLE AIRCRAFT (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(50),
    photos_path VARCHAR(255),
    engine VARCHAR(255),
    maximum_takeoff_weight BIGINT,
    year_first_production INT,
    TBO INT,
    maximum_occupants VARCHAR(10),
    maximum_cruise_speed INT,
    maximum_range INT,
    maximum_operating_altitude INT,
    wing_span FLOAT,
    length FLOAT,
    height FLOAT,
    takeoff_distance INT,
    descripton TEXT,
    company_id BIGINT
);

CREATE TABLE COMPANY (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    photo_path VARCHAR(255)
);