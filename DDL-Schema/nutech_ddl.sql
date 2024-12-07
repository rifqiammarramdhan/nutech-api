-- Users
CREATE SCHEMA IF NOT EXISTS users;

CREATE TABLE users.users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR (50) NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  first_name VARCHAR (50),
  last_name VARCHAR (50),
  profile_image VARCHAR
);

-- Informations
CREATE SCHEMA IF NOT EXISTS information;

CREATE TABLE information.banner (
  banner_id SERIAL PRIMARY KEY,
  banner_name VARCHAR (50) NOT NULL,
  banner_image VARCHAR NOT NULL,
  description VARCHAR
);

CREATE TABLE information.service (
  service_code VARCHAR PRIMARY KEY UNIQUE,
  service_name VARCHAR NOT NULL,
  service_icon VARCHAR NOT NULL,
  service_tariff INT NOT NULL
);


-- Transactions
CREATE SCHEMA IF NOT EXISTS Transactions;

CREATE TABLE transactions.user_accounts (
  usrac_id SERIAL PRIMARY KEY,
  user_id INT,
  balance INT,
  FOREIGN KEY (user_id) REFERENCES Users.Users(user_id)
);


CREATE TABLE transactions.transaction (
  usrac_id SERIAL PRIMARY KEY,
  invoice_number VARCHAR UNIQUE,
  user_id INT,
  service_code VARCHAR,
  service_name VARCHAR (50),
  description VARCHAR (50),
  transaction_type VARCHAR (25),
  total_amount INT,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES Users.Users(user_id),
  FOREIGN KEY (service_code) REFERENCES Information.Service(service_code)
);


