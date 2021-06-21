CREATE DATABASE company_db;

use company_db;

create table department (
id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(30),
PRIMARY KEY (id)
);

create table roles (
id INT NOT NULL AUTO_INCREMENT,
role_title VARCHAR(40)NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT NOT NULL, 
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(40),
last_name VARCHAR(50),
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES role(id),
FOREIGN KEY (manager_id) REFERENCES department(id)
);