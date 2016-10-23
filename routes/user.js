var express = require('express')
var router = express.Router()
// var passport = require('passport')
var User = require('../models/user')
// var session = require('express-session')
// var flash = require('connect-flash')

router.get('/', function (req, res) {
  User.find({}, function (err, allUsers) {
    if (err) throw err
    res.render('user/index', { data: allUsers })
  })
})

// .get('/:id', function (req, res) {
//   res.render('')
// }).get('/:id/update', function (req, res) {
//   res.render('')
// })

module.exports = router
