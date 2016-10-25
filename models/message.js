var mongoose = require('mongoose')

var messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  chat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  messagedate: Date
})

var Message = mongoose.model('Message', messageSchema)

module.exports = Message
