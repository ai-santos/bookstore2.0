import express from 'express'
import password from '../password'
import database from '../database'

const router = express.Router()

router.get('/books/user/:userId', (request, response) => {
  const userId = request.session.userId;
  if (!userId) return response.redirect('/login');

  database.getAllBooksByUserId(userId)
    .then((books) => {
      response.render('users/books', {
        books: books
      }) 
    })
    .catch(renderError(response))
});

// INDEX
router.get('/', (request, response) => {
  database.getAllBooks()
    .then((books) => {
      response.render('books/index', {
        books: books
      }) 
    })
    .catch(renderError(response))
});

// NEW
router.get('/books/new', (request, response) => {
  response.render('books/new')
});

// CREATE
router.post('/books', (request, response) => {
  const { title, image_url, description, author, genre } = request.body.book

  console.log("Aileen", title)
  Promise.all([
    database.createBook(title, image_url, description),
    database.createAuthor(author),
    database.createGenre(genre)
  ])
  .then(results => {
    console.log("results", results)
    const bookId = results[0].id
    const authorId = results[1].id
    const genreId = results[2].id
    Promise.all([
      database.associateBookWithGenres(bookId, genreId),
      database.associateBookWithAuthors(bookId, authorId)
      // database.associateUserIdWithBook(book, userId)
    ])
    .then(data => {
      console.log("data", data)
      response.redirect(`/books/${bookId}`)
    })   
    console.log("bookId", bookId, "authorId", authorId, "genreId", genreId)
  })
  .catch(renderError(response))
});

// SHOW
router.get('/books/:bookId', (request, response) => {
  const { bookId } = request.params
  database.getBookWithAuthorsAndGenres(bookId)
    .then(book => {
      response.render('books/show',{
        book: book
      })
    })
    .catch(renderError(response))
});

router.get('/books/:bookId/delete', (request, response) => {
  database.deleteBook(request.params.bookId)
    .then(() => {
      response.redirect(`/books/${bookId}`)
    })
    .catch(renderError(response))
});

router.get('/books/:bookId/edit', (request, response) => {
  console.log(request.params)
  
  Promise.all([
    database.getBookWithAuthorsAndGenres(request.params.bookId),
    database.getAllGenres(),
    database.getAllAuthors(),
  ])
    .then(details => {
      const book = details[0]
      const genres = details[1]
      const authors = details[2]
      response.render('books/edit', {
        book: book,
        genres: genres,
        authors: authors,
      }) 
    })
    .catch(renderError(response))
});

router.post('/books/:bookId', (request, response) => {
  const { bookId } = request.params
  database.updateBook(bookId, request.body.book)
    .then(() => {
      response.redirect('/books/'+bookId)
    })
    .catch(renderError(response))
});


const renderError = function(response){
  return function(error){
    response.status(500).render('error',{
      error: error
    })
  }
}

module.exports = router