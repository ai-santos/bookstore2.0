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

//CREATE BOOK WITH EXISTING AUTHOR, EXISTING GENRE


// CREATE BOOK WITH NEW AUTHOR, NEW GENRE
router.post('/books', (request, response) => {
  const { title, image_url, description, author1, author2, genre1, genre2 } = request.body.book
  Promise.all([
    database.createBook(title, image_url, description),
    database.createOneorMoreAuthors(author1, author2),
    database.createOneOrMoreGenres(genre1, genre2)
  ])
  .then(results => {
    const bookId = results[0]
    const authorId = results[1]
    const genreId = results[2]
    // console.log(results)
    console.log("bookId", bookId, "authorId", authorId, "genreId", genreId)
    Promise.all([
      database.associateBookWithGenres(bookId, genreId),
      database.associateBookWithAuthors(bookId, authorId)
      // database.associateUserIdWithBook(book, userId)
    ])
    .then(bla => {
      console.log('we are at the end of the createBook function')
      response.redirect(`/books/${bookId.id}`)
    })
  })   
  .catch(renderError(response))
});

// Details 
router.get('/books/:bookId', (request, response) => {
  const { bookId } = request.params
  console.log('we are in the details page', bookId)
  database.getBookWithAuthorsAndGenres(bookId)
    .then(book => {
      response.render('books/show',{
        book: book
      })
    })
    .catch(renderError(response))
});

// DELETE
router.get('/books/:bookId/delete', (request, response) => {
  database.deleteBook(request.params.bookId)
    .then(() => {
      response.redirect(`/books/${bookId}`)
    })
    .catch(renderError(response))
});

// Edit
router.get('/books/:bookId/edit', (request, response) => {
  console.log(request.params)
  
  Promise.all([
    database.getBookWithAuthorsAndGenres(request.params.bookId),
    database.getAllGenres(),
    database.getAllAuthors()
  ])
    .then(edit => {
      const book = edit[0]
      const genres = edit[1]
      const authors = edit[2]
      console.log("book", book)
      response.render('books/edit', {
        book: book,
        genres: genres,
        authors: authors
      }) 
    })
    .catch(renderError(response))
});

// Post Edit
router.post('/books/:bookId', (request, response) => {
  const { bookId } = request.params
  console.log("Post Edit", request.body.book)
  console.log("Post Edit bookId", bookId)
  database.updateBook(bookId, request.body.book)
    .then(() => {
      response.redirect('/books/'+bookId)
    })
    .catch(renderError(response))
});

const getPage = function(request){
  let page = parseInt(request.query.page, 10)
  if (isNaN(page) || page < 1) page = 1;
  return page;
}

//Search
router.get('/search-books', (request, response) => {
  let page = getPage(request)
  console.log("request.query.page", request.query.page)
  console.log("request.query", request.query)
  console.log("request.query.search_query", request.query.search_query)

  const searchOptions = {
    search_query: request.query.search_query,
    page: page
  }
  console.log("page", page)

  database.searchForBooks(searchOptions)
    .then(books => {
      books[0].authors = []
      books[0].genres = []

      response.render('books/search', {
        page: page,
        books: books
      })
    })
})


const renderError = function(response){
  return function(error){
    response.status(500).render('error',{
      error: error
    })
  }
}

module.exports = router