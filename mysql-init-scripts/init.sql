CREATE DATABASE IF NOT EXISTS testdb;

USE testdb;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

-- Add initial data if needed
INSERT INTO tasks (title) VALUES ('Sample Task 1');
INSERT INTO tasks (title) VALUES ('Sample Task 2');
