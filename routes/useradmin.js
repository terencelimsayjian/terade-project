var express = require('express')
var router = express.Router()
var passport = require('passport')
var User = require('../models/user')

// var session = require('express-session')
// var flash = require('connect-flash')

function authCheck (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/profile')
  } else {
    return next()
  }
}

router.get('/', function(req, res) {
  res.redirect('/listings')
})

router.route('/signup')
      .get(authCheck, function (req, res) {
        User.find({}, function (err, allUsers) {
          if (err) throw err
          res.render('terade/signup', {
            message: req.flash('signupMessage'),
            errMessage: req.flash('errMessage')
          })
        })
      })
      .post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
      }))

router.route('/login')
      .get(authCheck, function (req, res) {
        User.find({}, function (err, allUsers) {
          if (err) throw err
          res.render('terade/login', {
            message: req.flash('loginMessage')
          })
        })
      })
      .post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
      }))

router.get('/logout', function (req, res) {
  req.logout()
  req.flash('loginMessage', 'Logged out successfully')
  res.redirect('/login')
})

router.get('/profile', function (req, res) {
  res.render('terade/profile', {
    message: req.flash('profileMessage'),
    username: req.user.local.username,
    name: req.user.local.name,
    email: req.user.local.email,
    password: req.user.local.password
  })
})

module.exports = router
