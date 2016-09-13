import password from './password'
const pgp = require('pg-promise')();
const connectionString = `postgres://${process.env.USER}@localhost:5432/bookstore2.0`
const db = pgp(connectionString)

const createUser = (attributes) => {
  const sql = `
    INSERT INTO 
      users(email, encrypted_password, name, avatar_url) 
    VALUES 
      ($1, $2, $3, $4)
    RETURNING
      *
  `

  const encrypted_password = password.encrypt(attributes.password);

  const variables = [
    attributes.email,
    encrypted_password,
    attributes.name,
    attributes.avatar_url
  ]

  return db.one(sql, variables)
}

const getUserByEmail = (email) => {
  const sql = `
    SELECT 
      *
    FROM
      users
    WHERE
      users.email = $1
    LIMIT 
      1
  `
  const variables = [email]
  return db.oneOrNone(sql, variables)
}

const createBook = (attributes) => {
  const sql = `
    INSERT INTO
      books (title, image_url, description)
    VALUES ($1, $2, $3)
    RETURNING 
      id
  `
  const variables = [
    attributes.title,
    attributes.image_url,
    attributes.description
  ]

  return db.one(sql, variables)
  // create author and genre
}

const getAllBooks = () => {
  const sql = `
    SELECT 
      *
    FROM
      books
  `
  return db.manyOrNone(sql)
}

const getAllBooksByUserId = (userId) => {
  const sql = `
    SELECT 
      *
    FROM
      books
    JOIN
      book_users
    ON
      books.id = book_users.book_id
    WHERE
      book_users.user_id = $1
  `
  const variables = [userId]
  return db.manyOrNone(sql, [userId])
  // .then(books =>{
  //   Promise.all([
  //     getAuthorsForBookIds(books.map(book => book.id)),
  //     getAuthorsForBookIds(books.map(book => book.id)),
  //   ])
  // })
} 

const getAllGenres = () => {
  const sql = `
    SELECT
      *
    FROM
      genres
  `
  return db.any(sql);
}
const getAllAuthors = () => {
  const sql = `
    SELECT
      *
    FROM
      authors
  `
  return db.any(sql);
}

const deleteBook = (bookId) => {
  const sql = `
    DELETE FROM
      books
    WHERE
     id=$1
  `
  return db.none(sql, [bookId])
}

const getBook = (bookId) => {
  const sql = `
    SELECT 
      *
    FROM
      books
    WHERE
      books.id = $1
    LIMIT
      1
  `
  return db.oneOrNone(sql, [bookId])
}

const getBookWithAuthorsAndGenres = (bookId) => {
  return Promise.all([
    getBook(bookId),
    getAuthorsForBook(bookId),
    getGenresForBook(bookId),
  ]).then(results => {
    const book = results[0]
    book.authors = results[1]
    book.genres = results[2]
    return book;
  })
}

const getAuthorsForBook = (bookId) => {
  const sql = `
    SELECT
      *
    FROM
      authors
    JOIN
      book_authors
    ON
      book_authors.author_id = authors.id
    WHERE
      book_authors.book_id = $1
  `
  return db.any(sql, [bookId])
}

const getGenresForBook = (bookId) => {
  const sql = `
    SELECT
      *
    FROM
      genres
    JOIN
      book_genres
    ON
      book_genres.genre_id = genres.id
    WHERE
      book_genres.book_id = $1
  `
  return db.any(sql, [bookId])
}

const getOneUserByUserId = (userId) => {
  const sql = `
    SELECT
      id
    FROM
      users
    WHERE 
      user.id = $1
    LIMIT
      1
  `
  return db.oneOrNone(sql, [userId])
}

const updateBook = (bookId, attributes) => {
  const sql = `
    UPDATE 
      books
    SET
      image_url = $2,
      title = $3,
      description = $4
    WHERE
      id = $1
  `

  const variables = [
    bookId,
    attributes.image_url,
    attributes.title,
    attributes.description
  ] 

  const updateBookQuery = db.none(sql, variables)
  const queries = [
    updateBookQuery,
    replaceBookGenreAssociations(bookId, attributes.genre_ids),
    replaceBookAuthorAssociations(bookId, attributes.author_ids)
  ]

  return Promise.all(queries)
}

const associateBookWithGenres = (bookId, genreIds) => {
  const queries = genreIds.map(genreId => {
    const sql = `
      INSERT INTO 
        book_genres(book_id, genre_id)
      VALUES
        ($1, $2)
    `
    return db.none(sql, [bookId, genreId])
  })
  return Promise.all(queries)
}

const replaceBookGenreAssociations = (bookId, genreIds) => {
  db.none('DELETE FROM book_genres WHERE book_id=$1', [bookId])
    .then(() => {
      return associateBookWithGenres(bookId, genreIds)
    })
}

const replaceBookAuthorAssociations = (bookId, authorIds) => {
    db.none('DELETE FROM book_authors WHERE book_id=$1', [bookId])
    .then(() => {
      const queries = authorIds.map(authorId => {
        const sql = `
          INSERT INTO 
            book_authors(book_id, author_id)
          VALUES
            ($1, $2)
        `
        return db.none(sql, [bookId, authorId])
      })
      return Promise.all(queries)
    })
}

export default { 
  createUser,
  getUserByEmail,
  deleteBook,
  getAllBooks,
  getAllBooksByUserId,
  getAllGenres,
  getAllAuthors,
  getBook,
  getBookWithAuthorsAndGenres,
  updateBook
}
