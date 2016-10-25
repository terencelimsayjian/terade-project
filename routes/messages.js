var express = require('express')
var router = express.Router()
var Message = require('../models/listing')

router.get('/', function (req, res) {
  res.render('message/index')
})

module.exports = router
