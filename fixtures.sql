INSERT INTO
  users (id, email, encrypted_password, name, avatar_url)
VALUES
  (100, 'a@a.com', '$2a$10$Jq6K5.u4QpITbj44fMxMxe0fUNv94lYXhqpG6GzdgxLqI3sBzqX8u', 'aileen', 'http://i.imgur.com/HqbTeu0t.jpg'),
  (101, 'b@b.com', '$2a$10$Jq6K5.u4QpITbj44fMxMxe0fUNv94lYXhqpG6GzdgxLqI3sBzqX8u', 'bob', 'http://i.imgur.com/HqbTeu0t.jpg'),
  (102, 'c@c.com', '$2a$10$Jq6K5.u4QpITbj44fMxMxe0fUNv94lYXhqpG6GzdgxLqI3sBzqX8u', 'carol', 'http://i.imgur.com/HqbTeu0t.jpg')
;

INSERT INTO 
  books (id, image_url, title, description)
VALUES
  (1, 'http://i.imgur.com/SwgeflMt.png', 'JavaScript and JQuery: Interactive Front-End Web Development 1st Edition', 'This full-color book will show you how to make your websites more interactive and your interfaces more interesting and intuitive.'),
  (2, 'http://i.imgur.com/MTZnZADt.jpg', 'Clean Code: A Handbook of Agile Software Craftsmanship 1st Edition', ''),
  (3, 'http://i.imgur.com/B4C2gpit.jpg', 'JavaScript Patterns 1st Edition', 'What is the best approach for developing an application with JavaScript? This book helps you answer that question with numerous JavaScript coding patterns and best practices.')
;

INSERT INTO
  genres (id, name)
VALUES
  (20, 'non-fiction')
;

INSERT INTO
  authors (id, name)
VALUES
  (10, 'Jon Duckett'),
  (11, 'Robert C. Martin'),
  (12, 'Stoyan Stefanov')
;


INSERT INTO
  book_users(user_id, book_id)
VALUES
  (100, 1),
  (101, 2),
  (102, 3)
;

INSERT INTO
  book_genres(book_id, genre_id)
VALUES
  (1, 101),
  (2, 101),
  (3, 101)
;

INSERT INTO
  book_authors(book_id, author_id)
VALUES
  (1, 10),
  (2, 11),
  (3, 12)
;

