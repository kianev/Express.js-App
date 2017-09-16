const express = require('express')
const port = 1234
const path = require('path')
const pug = require('pug')

//init app
const app = express()

//load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//home rout
app.get('/', (req, res) => {
  let articles = [
    {
      id: 1,
      title: 'Article1',
      author: 'John',
      body: 'This is Article One'
    },
    {
      id: 2,
      title: 'Article2',
      author: 'Pesho',
      body: 'This is Article Two'
    },
    {
      id: 3,
      title: 'Article3',
      author: 'Gosho',
      body: 'This is Article Three'
    }
  ]
  res.render('index', {
    title: 'Articles',
    articles: articles
  })
})

//add route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})