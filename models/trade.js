var mongoose = require('mongoose')

var tradeSchema = new mongoose.Schema({
  proposer_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  proposer_listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  proposee_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  proposee_listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  listdate: Date,
  status: String
})

var Trade = mongoose.model('Trade', tradeSchema)

module.exports = Trade
