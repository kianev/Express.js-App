const express = require('express')
const port = 1234
const path = require('path')
const pug = require('pug')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodekb')
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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')))


//home rout
app.get('/', (req, res) => {
  Article.find({}, (err, articles)=> {
    if(err) {
      console.log(err)
    }else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      })
    }
  })
})

//get single article
app.get('/article/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article: article
    })
  })
})

//add route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  })
})

//add sumbit post route
app.post('/articles/add', (req, res) => {
  let article = new Article()
  article.title = req.body.title
  article.author = req.body.author
  article.body = req.body.body

  article.save((err) => {
    if(err) {
      console.log(err)
    }else {
      res.redirect('/')
    }
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})