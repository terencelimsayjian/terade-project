var mongoose = require('mongoose')

var messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  messagedate: Date,
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
  }
})

var Message = mongoose.model('Message', messageSchema)

module.exports = Message
