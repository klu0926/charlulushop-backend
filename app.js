  if (process.env.NODE_ENV !== 'production') {
    console.log('use dotenv')
    require('dotenv').config()
  }

  const express = require('express')
  const app = express()
  const port = process.env.PORT || 3000
  const routes = require('./routes')
  const methodOverride = require('method-override')
  const handlebarHelper = require('./helpers/handlebarHelper')
  const path = require('path')
  const session = require('express-session')
  const checkSessionAuth = require('./middleware/sessionAuth')
  const cors = require('cors')
  const flash = require('./helpers/flash')

  // view engine
  const { engine } = require('express-handlebars')
  app.engine(
    'hbs',
    engine({
      defaultLayout: 'main', extname: '.hbs', helpers: handlebarHelper,
    })
  )
  app.set('view engine', 'hbs')
  app.set('views', path.join(__dirname, 'views'))

  // cors
  const corsOption = {
    origin: [
      'http://localhost:3001',
      'https://klu0926.github.io',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
  app.use(cors(corsOption))

  // session
  const MemoryStore = session.MemoryStore
  const memoryStore = new MemoryStore()
  app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }))
  app.use(checkSessionAuth)
  app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuth = req.isAuthenticated
    res.locals.error = flash.getFlash(req, 'error')
    next()
  })

  // middleware
  app.use(express.static('public'))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(methodOverride('_method'))
  app.use(routes)

  app.listen(port, () => {
    console.log('-----------------------------')
    console.log(`Sever running on port ${port}`)
    console.log('current NODE_ENV : ' + process.env.NODE_ENV)
    console.log('-----------------------------')
  })


