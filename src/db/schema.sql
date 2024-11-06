-- Drop database if exists and create new one
DROP DATABASE IF EXISTS staffsync_pro;
CREATE DATABASE staffsync_pro;

-- Connect to the new database
\c staffsync_pro;

-- Create department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL REFERENCES department(id) ON DELETE CASCADE
);

-- Create employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    manager_id INTEGER REFERENCES employee(id) ON DELETE SET NULL
);

-- Insert initial department data
INSERT INTO department (name) VALUES 
    ('Innovation Lab'),
    ('Financial Strategy'),
    ('Legal Operations'),
    ('Business Growth');

-- Insert initial role data
INSERT INTO role (title, salary, department_id) VALUES
    ('Innovation Director', 150000, 1),
    ('Solutions Architect', 120000, 1),
    ('Finance Director', 160000, 2),
    ('Financial Analyst', 125000, 2),
    ('Legal Director', 250000, 3),
    ('Corporate Counsel', 190000, 3),
    ('Growth Director', 100000, 4),
    ('Business Developer', 80000, 4);

-- Insert initial employee data
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Alex', 'Mitchell', 1, NULL),
    ('Jordan', 'Parker', 2, 1),
    ('Morgan', 'Chase', 3, NULL),
    ('Taylor', 'Rivers', 4, 3),
    ('Casey', 'Stone', 5, NULL),
    ('Riley', 'Brooks', 6, 5),
    ('Quinn', 'Foster', 7, NULL),
    ('Jamie', 'Blake', 8, 7);