CREATE DATABASE JWT;

--before that set extension inside database
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL 
    );

--Insert into database
INSERT INTO users (user_name, user_email, user_password) VALUES ('MANNAWAR', 'mannawar@gmail.com', 'mann123');