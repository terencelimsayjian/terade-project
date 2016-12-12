var express = require('express')
var router = express.Router()
var userController = require('../controller/userController')

router.route('/')
      .get(userController.getUsers)

module.exports = router
