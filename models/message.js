var mongoose = require('mongoose')

var messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  chatbox_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  messagedate: Date
})

var Message = mongoose.model('Message', messageSchema)

module.exports = Message
