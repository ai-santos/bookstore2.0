import express from 'express'
import password from '../password'
import database from '../database'

const router = express.Router()

router.get('/', (request, response) => {
  database.getAllBooks()
    .then((books) => {
      response.render('books/index', {
        books: books
      }) 
    })
    .catch(renderError(response))
});

router.get('/signup', (request, response) => {
  response.render('users/signup')
})

router.post('/signup', (request, response) => {
  database.createUser(request.body.user)
    .then(user => {
      request.session.userId = user.id
      response.redirect('/')
    })
    .catch(error => {
      response.render('error', {error: error})
    })
})


router.get('/login', (request, response) => {
  response.render('users/login', {
    email: '',
  })
})

router.post('/login', (request, response) => {
  database.getUserByEmail(request.body.email)
    .then(user => {
      if (user && password.compare(request.body.password, user.encrypted_password)) {
        request.session.userId = user.id
        response.redirect('library/'+user.id)
      }else{
        response.render('users/login', {
          email: request.body.email,
          error: 'Bad email or password'
        })
      }
    })
    .catch(error => {
      response.render('error', {error: error})
    })
})

router.get('/logout', (request, response) => {
  request.session = null
  response.redirect('/')
})

const renderError = function(response){
  return function(error){
    response.status(500).render('error',{
      error: error
    })
  }
}

module.exports = router