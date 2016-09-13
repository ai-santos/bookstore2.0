DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL CHECK (email <> ''),
  encrypted_password VARCHAR(255) NOT NULL CHECK (encrypted_password <> ''),
  name VARCHAR(255) NOT NULL CHECK (name <> ''),
  avatar_url VARCHAR(255) 
);

DROP TABLE IF EXISTS books;

CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  image VARCHAR(255),
  title text NOT NULL CHECK (title <> ''),
  description text
);

DROP TABLE IF EXISTS genres;

CREATE TABLE genres(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

DROP TABLE IF EXISTS authors;

CREATE TABLE authors(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

DROP TABLE IF EXISTS book_genres;

CREATE TABLE book_genres(
  genre_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS book_users;

CREATE TABLE book_users(
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS book_authors;

CREATE TABLE book_authors(
  author_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL
);




