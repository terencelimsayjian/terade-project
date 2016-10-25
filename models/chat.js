var mongoose = require('mongoose')

var chatSchema = new mongoose.Schema({
  proposer_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  proposee_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
})

var Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
