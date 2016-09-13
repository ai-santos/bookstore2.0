import express from 'express'
import password from '../password'
import database from '../database'

const router = express.Router()

router.get('/library', (request, response) => {
  const userId = request.session.userId;
  if (!userId) return response.redirect('/login');

  database.getAllBooksByUserId(userId)
    .then((books) => {
      response.render('users/library', {
        books: books
      }) 
    })
    .catch(renderError(response))
});


router.get('/books/:bookId/delete', (request, response) => {
  database.deleteBook(request.params.bookId)
    .then(() => {
      response.redirect('/library')
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