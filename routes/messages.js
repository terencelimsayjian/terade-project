var express = require('express')
var router = express.Router()
var Message = require('../models/message')
var Listing = require('../models/listing')
var User = require('../models/user')

router.get('/', function (req, res) {
  Message.find({}, function (err, userMessages) {
    if (err) throw err
    res.render('message/index', { userMessages: userMessages })
  })
})

router.get('/mymessages', function (req, res) {
  Message.find({ proposer_user_id: req.user.id }, function (err, userMessages) {
    if (err) throw err
    res.render('message/message', { userMessages: userMessages })
  })
})

router.get('/:ownerID/:listingID/new', function (req, res) {
  User.findOne({ _id: req.params.ownerID })
  .populate('user_id', 'local.username')
  .exec(function (err, ownerUser) {
    if (err) throw err
    Listing.findOne({ _id: req.params.listingID })
    .populate('_id', 'name')
    .exec(function (err, listing) {
      if (err) throw err
      res.render('message/create', { ownerUser: ownerUser, listing: listing, user: req.user })
    })
  })
})

router.post('/', function (req, res) {
  var newMessage = new Message({
    message: req.body.message,
    messagedate: Date.now(),
    proposer_user_id: req.user._id,
    proposee_user_id: req.body.ownerUserID,
    listing_id: req.body.listingID
  })
  newMessage.save()
  res.redirect('/messages')
})

module.exports = router
