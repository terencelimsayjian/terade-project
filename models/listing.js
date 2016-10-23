var mongoose = require('mongoose')

var listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  listdate: Date,
  availability: Boolean,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

var Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing
