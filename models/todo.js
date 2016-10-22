var mongoose = require('mongoose')

var todoSchema = new mongoose.Schema({
  item: String,
  deadline: Date,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

var Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo
