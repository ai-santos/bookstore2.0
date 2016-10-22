import password from './password'
const pgp = require('pg-promise')();
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/bookstore2.0`
const db = pgp(connectionString)

const getAllGenres = () => {
  const sql = `
    SELECT
      *
    FROM
      genres
  `
  return db.manyOrNone(sql)
}

const getAllAuthors = () => {
  const sql = `
    SELECT
      *
    FROM
      authors
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
  //     getGenresForBookIds(books.map(book => book.id)),
  //   ])
  // })
} 

// const getAllGenresByUserId = (userId) => {
//   const sql = `
//     SELECT
//       *
//     FROM
//       genres
//     JOIN
//       book_genres
//     ON
//       books.id = book_genres.book_id
//     WHERE
//       book_genres.user_id

//   `
//   return db.any(sql);
// }

// const getAllAuthorsByUserId = () => {
//   const sql = `
//     SELECT
//       *
//     FROM
//       authors
//   `
//   return db.any(sql);
// }

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

const createBook = (title, image_url, description) => {
  const sql = `
    INSERT INTO
      books (title, image_url, description)
    VALUES 
      ($1, $2, $3)
    RETURNING 
      id
  `
  const variables = [
    title,
    image_url,
    description
  ]

  return db.one(sql, variables)
  // create author and genre
}

const createOneorMoreAuthors = (author1, author2) => {
  let authors = [ author1, author2 ]
  const queries = authors.map(name => { 
    if (name !== '' && name !== undefined) {
      const sql = `
        INSERT INTO
          authors (name)
        VALUES
          ($1)
        RETURNING
          id
      `
      return db.one(sql, [name])
    }  
    console.log("createAuthor")
    })  
  return Promise.all(queries)
}

const createOneOrMoreGenres = (genre1, genre2) => {
  let genres = [ genre1, genre2 ]
  const queries = genres.map(name => {
    if (name !== '' && name !== undefined) {
      const sql = `
        INSERT INTO
          genres (name)
        VALUES
          ($1)
        RETURNING
          id
      `
    return db.one(sql, [name])
    }
    console.log("createGenre")
  })
  return Promise.all(queries)
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
  console.log("attributes", attributes)
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

const replaceBookGenreAssociations = (bookId, genreIds) => {
  db.none('DELETE FROM book_genres WHERE book_id=$1', [bookId])
    .then(() => {
      return associateBookWithGenres(bookId, genreIds)
    })
}

const replaceBookAuthorAssociations = (bookId, authorIds) => {
  db.none('DELETE FROM book_authors WHERE book_id=$1', [bookId])
  .then(() => {
    return associateBookWithAuthors(bookId, authorIds)
  })
}

// const associateUserIdwithBook = (bookId, userId) => {

// }

const associateBookWithGenres = (bookId, genreIds) => {
  if (typeof genreIds === 'number') { [genreIds] }
    const queries = genreIds.map(genreId=> {
      if (genreId !== '' && genreId !== undefined) {
        const sql = `
          INSERT INTO 
            book_genres(book_id, genre_id)
          VALUES
            ($1, $2)
        `
        return db.any(sql, [bookId.id, genreId.id])
      }
    })
    return Promise.all(queries)
}


const associateBookWithAuthors = (bookId, authorIds) => {
  if (typeof authorIds === 'number') { [authorIds] }
    const queries = authorIds.map(authorId => {
      if (authorId !== '' && authorId !== undefined) {
        const sql = `
          INSERT INTO 
            book_authors(book_id, author_id)
          VALUES
            ($1, $2)
        `
        return db.any(sql, [bookId.id, authorId.id])
      }
    })
    return Promise.all(queries)
}

const PAGE_SIZE=8

const pageToOffset = (page) => {
  page = page || 1
  return (page-1)*PAGE_SIZE;
}

const searchForBooks = (options) => {
  const variables = []
  let sql = `
    SELECT
      DISTINCT(books.*)
    FROM
      books
  `
  if (options.search_query) {
    let search_query = options.search_query
      .toLowerCase()
      .replace(/^ */, '%')
      .replace(/ *$/, '%')
      .replace(/ +/g, '%')

    variables.push(search_query)
    sql +=`
      JOIN
        book_authors
      ON
        books.id = book_authors.book_id
      JOIN
        authors
      ON
        authors.id = book_authors.author_id
      JOIN
        book_genres
      ON
        books.id = book_genres.book_id
      JOIN
        genres
      ON
        genres.id = book_genres.genre_id
      WHERE
        LOWER(books.title) LIKE $${variables.length}
      OR
        LOWER(authors.name) LIKE $${variables.length}
      OR
        LOWER(genres.name) LIKE $${variables.length}
    `
  }

  if (options.page){
    variables.push(PAGE_SIZE)
    variables.push(pageToOffset(options.page))
    sql += `
      LIMIT $${variables.length-1}
      OFFSET $${variables.length}
    `
  }
  return db.any(sql, variables)
}


export default { 
  createBook,
  createUser,
  createOneorMoreAuthors,
  createOneOrMoreGenres,
  associateBookWithGenres,
  associateBookWithAuthors,
  getUserByEmail,
  deleteBook,
  getAllBooks,
  getAllBooksByUserId,
  getAllGenres,
  getAllAuthors,
  getBook,
  getBookWithAuthorsAndGenres,
  updateBook,
  searchForBooks
}
