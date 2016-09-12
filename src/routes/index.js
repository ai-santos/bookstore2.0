import express from 'express'

const router = express.Router()

router.get('/', (request, response) => {
  response.render('index')
})

router.get('/signup', (request, response) => {
  response.render('users/signup')
})

router.get('/login', (request, response) => {
  response.render('users/login')
})

router.get('/logout', (request, response) => {
  response.redirect('/')
})

module.exports = router