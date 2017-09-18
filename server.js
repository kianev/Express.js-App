const express = require('express')
const port = 1234
const path = require('path')
const pug = require('pug')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const config = require('./config/database')
const passport = require('passport')

mongoose.connect(config.database)
let db = mongoose.connection

//check connection
db.once('open', () => {
  console.log('Connected to MongoDB')
})

//check for DB Errors
db.on('error', (err) => {
  console.log(err)
})

//init app
const app = express()

//Bring the models
let Article = require('./models/article')

//load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')))

//express-session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

//express-messages middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//express-validator middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    let namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

//passport config
require('./config/passport')(passport)
//passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

//home rout
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err)
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      })
    }
  })
})

//Route files
let articles = require('./routes/articles')
let users = require('./routes/users')
app.use('/articles', articles)
app.use('/users', users)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})