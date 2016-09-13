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

const getAllBooksByUserId = (userId) => {
  const sql = `
    SELECT 
      *
    FROM
      book_users
    WHERE
      user_id = $1
  `
  const variables = [userId]
  return db.manyOrNone(sql, [userId])
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

export default { 
  createUser,
  getUserByEmail,
  deleteBook,
  getAllBooksByUserId
}
