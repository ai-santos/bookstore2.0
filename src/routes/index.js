import express from 'express'

const router = express.Router()

router.get('/', (request, response) => {
  request.session.times = (request.session.times || 0) + 1
  response.render('index', {
    session: request.session
  }) 
})

router.get('/signup', (request, response) => {
  response.render('users/signup')
})

router.post('/signup', (request, response) => {
  response.json(request.body)
})


router.get('/login', (request, response) => {
  response.render('users/login')
})

router.get('/logout', (request, response) => {
  response.redirect('/')
})

module.exports = router