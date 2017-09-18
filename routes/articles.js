const express = require('express')
const router = express.Router()

//Bring in Article model
let Article = require('../models/article')
//Bring the User model
let User = require('../models/user')


//add route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  })
})

//add sumbit post route
router.post('/add', (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty()
  //req.checkBody('author', 'Author is required').notEmpty()
  req.checkBody('body', 'Body is required').notEmpty()

  //get Errors
  let errors = req.validationErrors()
  if(errors){
    res.render('add_article', {
      title: 'Add Article',
      errors: errors
    })
  }else {
    let article = new Article()
    article.title = req.body.title
    article.author = req.user._id
    article.body = req.body.body

    article.save((err) => {
      if(err) {
        console.log(err)
      }else {
        req.flash('success', 'Article added.')
        res.redirect('/')
      }
    })
  }
})

//Load edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
  if(article.author != req.user._id){
    req.flash('danger', 'Not Authorized')
    res.redirect('/')
  }
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    })
  })
})

//update sumbit
router.post('/edit/:id', (req, res) => {
  let article = {}
  article.title = req.body.title
  article.author = req.body.author
  article.body = req.body.body

  let query = {_id: req.params.id}

  Article.update(query, article, (err) => {
    if(err) {
      console.log(err)
    }else {
      req.flash('success', 'Article updated.')
      res.redirect('/')
    }
  })
})

//delete Article
router.delete('/:id', (req, res) => {
  let query = {_id: req.params.id}

  Article.remove(query, (err) => {
    if(err){
      console.log(err)
    }
    res.send('Success')
  })
})

//get single articler
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (err, user) => {
      res.render('article', {
        article: article,
        author: user.name
      })
    })
  })
})

//Access control
function ensureAuthenticated (req, res, next) {
  if(req.isAuthenticated()){
    return next()
  }else {
    req.flash('danger', 'Please login!')
    res.redirect('/users/login')
  }
}

module.exports = router
