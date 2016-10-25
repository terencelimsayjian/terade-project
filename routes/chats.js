var express = require('express')
var router = express.Router()
var Message = require('../models/message')
var Listing = require('../models/listing')
var User = require('../models/user')
var Chat = require('../models/chat')

router.get('/', function (req, res) {
  Chat.find({}, function (err, userMessages) {
    if (err) throw err
    res.render('chat/index', { userMessages: userMessages })
  })
})

router.get('/mychats', function (req, res) {
  Chat.find({ $or: [ { proposer_user_id: req.user.id }, { proposee_user_id: req.user.id } ]}, function (err, userChats) {
    if (err) throw err
    res.render('chat/message', { userChats: userChats })
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
      res.render('chat/create', { ownerUser: ownerUser, listing: listing, user: req.user })
    })
  })
})

router.post('/', function (req, res) {
  var newChat = new Chat({
    proposer_user_id: req.user._id,
    proposee_user_id: req.body.ownerUserID,
    listing_id: req.body.listingID,
    messages: []
  })
  var newMessage = new Message({
    message: req.body.message,
    chatbox_id: newChat._id,
    messagedate: Date.now()
  })

  newMessage.save()
  newChat.messages.push(newMessage._id)

  newChat.save()

  res.redirect('/chats')
})

module.exports = router
