import express from 'express'
import expressSession from 'express-session'
import routes from './routes'
import pug from 'pug'
import path from 'path'
import bodyParser from 'body-parser'
import logger from 'morgan'

const server = express()

//view engine setup
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'pug')

//routes
server.use('/', routes)

//local host
server.listen(process.env.PORT || 3000)