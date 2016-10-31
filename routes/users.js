var express = require('express')
var router = express.Router()
var User = require('../models/user')
var userController = require('../controller/userController')

router.route('/')
      .get(userController.getUsers)

module.exports = router
