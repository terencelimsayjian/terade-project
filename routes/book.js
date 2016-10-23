var express = require('express')
var router = express.Router()
var Todo = require('../models/todo')

router.get('/', function (req, res) {
  Todo.find({}, function (err, allTodo) {
    if (err) throw err
    res.render('todo/index', { data: allTodo })
  })
})

router.post('/', function (req, res) {
  Todo.create(req.body.todo, function (err, todoItem) {
    if (err) throw err
    res.json(todoItem)
  })
})

module.exports = router
