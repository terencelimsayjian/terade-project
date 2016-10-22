var express = require('express')
var router = express.Router()
var passport = require('passport')
var User = require('../models/user')
// var session = require('express-session')
// var flash = require('connect-flash')

function authCheck (req, res, next) {
  if (req.isAuthenticated()) {
    req.flash('signupMessage', 'You have logged in, what are you doing bruh?')
    return res.redirect('/users/profile')
  } else {
    return next()
  }
}

router.get('/', function (req, res) {
  User.find({}, function (err, allUsers) {
    if (err) throw err
    res.render('user/index', { data: allUsers })
  })
})

router.route('/signup')
      .get(authCheck, function (req, res) {
        User.find({}, function (err, allUsers) {
          if (err) throw err
          res.render('user/signup', {
            message: req.flash('signupMessage')
          })
        })
      })
      .post(passport.authenticate('local-signup', {
        successRedirect: '/users/profile',
        failureRedirect: '/users/signup',
        failureFlash: true
      }))

router.get('/profile', function (req, res) {
  User.find({}, function (err, allUsers) {
    if (err) throw err
    res.render('user/profile', {
      allUsers: allUsers,
      message: req.flash('signupMessage')
    })
  })
})

router.route('/login')
      .get(function (req, res) {
        res.render('user/login', { message: req.flash('loginMessage') })
      })
      .post(passport.authenticate('local-login', {
        successRedirect: '/users/profile',
        failureRedirect: '/users/login',
        failureFlash: true
      }))

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/users/login')
})

// .get('/:id', function (req, res) {
//   res.render('')
// }).get('/:id/update', function (req, res) {
//   res.render('')
// })

// router.post('/', function (req, res) {
//   var newUser = new User({
//     username: req.body.user.username,
//     name: req.body.user.name,
//     email: req.body.user.email
//   })
//
//   newUser.save()
//   res.redirect('/users')
// })

router.post('/', function (req, res) {

})

module.exports = router
