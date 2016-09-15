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

  console.log("Aileen", request.body)
  Promise.all([
    database.createBook(request.body.book),
    database.createAuthor(request.body.author),
    database.createGenre(request.body.genre)
  ])
  .then(results => {
    const [ book, authors, genres ] = result 
    Promise.all([
      database.associateBookWithGenres(book, genres),
      database.associateBookWithAuthors(book, authors),
      // database.associateUserIdWithBook(book, userId)
    ])   
    console.log("Majid", results)
    response.redirect(`/books/${results.id}`)
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