import express from 'express'
import cookieSession from 'cookie-session'
import routes from './routes'
import pug from 'pug'
import path from 'path'
import bodyParser from 'body-parser'
import logger from 'morgan'

const server = express()

server.set('trust proxy', 1) // trust first proxy

//view engine setup
server.set('views', path.join(__dirname, 'views'))
server.use(express.static(path.join(__dirname, 'public')));
server.set('view engine', 'pug')

//middleware
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }))

server.use(cookieSession({
  name: 'session',
  keys: [
    '373dad52c4c6a61ed92454b2b9b6d675795eedab', 
    'bf581d4db65d9ea10f69d52800ff811f76949d71'
  ]
}))

server.use(function (request, response, next) {
  response.locals.loggedIn = 'userId' in request.session
  next()
})

//routes
server.use('/', routes)


//local host
server.listen(process.env.PORT || 3000)