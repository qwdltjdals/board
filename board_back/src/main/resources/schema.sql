--DROP TABLE IF EXISTS USER;
--DROP TABLE IF EXISTS ROLE;
--DROP TABLE IF EXISTS USER_ROLES;
--DROP TABLE IF EXISTS OAUTH2_USER;
--DROP TABLE IF EXISTS BOARD;
--
--CREATE TABLE USER (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    username VARCHAR(255) UNIQUE not null,
--    password VARCHAR(255) not null,
--    name VARCHAR(255) not null,
--    email VARCHAR(255) not null,
--    img TEXT not null DEFAULT 'https://firebasestorage.googleapis.com/v0/b/userprofile-f5b44.appspot.com/o/user%2Fdefault.png?alt=media&token=0df941fa-8286-412a-b19b-ee4ce8dc5a77'
--);
--
--CREATE TABLE ROLE (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    name VARCHAR(255) UNIQUE not null
--);
--
--INSERT INTO ROLE
--VALUES(DEFAULT, 'ROLE_USER'),
--        (DEFAULT, 'ROLE_MANAGER'),
--        (DEFAULT, 'ROLE_ADMIN');
--
--CREATE TABLE USER_ROLES (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    user_id BIGINT not null,
--    role_id BIGINT not null
--);
--
--CREATE TABLE OAUTH2_USER (
--    id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    user_id BIGINT not null,
--    oauth2_name VARCHAR(255) UNIQUE not null,
--    provider VARCHAR(255) not null
--);
--
--CREATE TABLE BOARD (
--    id BIGINT PRIMARY KEY AUTO_INCREMENT,
--    title VARCHAR(255) not null,
--    content LONGTEXT not null,
--    user_id BIGINT not null,
--    view_count int not null DEFAULT 0
--);
--
--CREATE TABLE TEST1 (
--    id BIGINT not null AUTO_INCREMENT PRIMARY KEY,
--    username VARCHAR(255) not null,
--    name VARCHAR(255) not null,
--    gender INT not null
--);

CREATE TABLE board_like(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    board_id BIGINT not null,
    user_id BIGINT not null
);



--ALTER TABLE BOARD ADD COLUMN view_count int not null DEFAULT 0;

