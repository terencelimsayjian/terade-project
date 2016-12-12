var Chat = require('../models/chat')
var Message = require('../models/message')
var User = require('../models/user')
var Listing = require('../models/listing')

var chatController = {
  getChats: function (req, res) {
    Chat.find({}, function (err, userChats) {
      if (err) throw err
      res.render('chat/index', {
        userChats: userChats,
        header: 'All Chats'
      })
    })
  },

  getMyChats: function (req, res) {
    Chat.find({$or: [ { proposer_user_id: req.user._id }, { proposee_user_id: req.user._id } ]})
      .populate('proposer_user_id', 'local.username')
      .populate('proposee_user_id', 'local.username')
      .populate('listing_id', 'name')
      .exec(function (err, userChats) {
        if (err) throw err
        res.render('chat/index', {
          userChats: userChats,
          header: 'My Chats'
        })
      })
  },

  getThisChat: function (req, res) {
    Message.find({ chat_id: req.params.chatID })
    .populate('user_id', 'local.username')
    .exec(function (err, chatMessages) {
      if (err) throw err
      Chat.findOne({ _id: req.params.chatID })
      .populate('proposer_user_id', 'local.username')
      .populate('proposee_user_id', 'local.username')
      .populate('listing_id', 'name')
      .exec(function (err, chat) {
        if (err) throw err
        res.render('chat/messages', {
          chatMessages: chatMessages,
          chatID: req.params.chatID,
          chat: chat
        })
      })
    })
  },

  newChatToUser: function (req, res) {
    User.findOne({ _id: req.params.ownerID })
    .populate('user_id', 'local.username')
    .exec(function (err, ownerUser) {
      if (err) throw err
      Listing.findOne({ _id: req.params.listingID })
      .populate('_id', 'name')
      .exec(function (err, listing) {
        if (err) throw err
        res.render('chat/create', {
          ownerUser: ownerUser,
          listing: listing,
          user: req.user
        })
      })
    })
  },

  postNewChat: function (req, res) {
    var newChat = new Chat({
      proposer_user_id: req.user._id,
      proposee_user_id: req.body.ownerUserID,
      listing_id: req.body.listingID,
      messages: []
    })
    var newMessage = new Message({
      message: req.body.message,
      chat_id: newChat._id,
      user_id: req.user._id,
      messagedate: Date.now()
    })

    newMessage.save()
    newChat.messages.push(newMessage._id)

    newChat.save()

    res.redirect('/chats/mychats/' + newChat._id)
  },

  postChatToUser: function (req, res) {
    var newMessage = new Message({
      message: req.body.message,
      chat_id: req.params.chatID,
      user_id: req.user._id,
      messagedate: Date.now()
    })
    newMessage.save()
    Chat.findOne({ _id: req.params.chatID }, function (err, foundChat) {
      if (err) throw err
      foundChat.messages.push(newMessage._id)
    })
    res.redirect('/chats/mychats/' + req.params.chatID)
  }

}

module.exports = chatController
