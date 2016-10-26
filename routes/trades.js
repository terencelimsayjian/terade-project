var express = require('express')
var router = express.Router()
var Trade = require('../models/trade')
var Listing = require('../models/listing')
var Chat = require('../models/chat')
var Message = require('../models/message')

router.get('/', function (req, res) {
  Trade.find({}, function (err, allTrades) {
    if (err) throw err
    res.render('trade/index', { data: allTrades })
  })
})

router.get('/offers', function (req, res) {
  Trade.find({ proposee_user_id: req.user.id })
  .populate('proposer_user_id', 'local.username')
  .populate('proposer_listing_id', 'name')
  .populate('proposee_user_id', 'local.username')
  .populate('proposee_listing_id', 'name')
  .exec(function (err, myOffers) {
    if (err) throw err
    res.render('trade/receivedoffers', { data: myOffers })
  })
})

router.get('/offered', function (req, res) {
  Trade.find({ proposer_user_id: req.user.id })
  .populate('proposer_user_id', 'local.username')
  .populate('proposer_listing_id', 'name')
  .populate('proposee_user_id', 'local.username')
  .populate('proposee_listing_id', 'name')
  .exec(function (err, myOffered) {
    if (err) throw err
    res.render('trade/madeoffers', { data: myOffered })
  })
})

router.get('/:userID/:listingID/selecttrade', function (req, res) {
  Listing.find({ user_id: req.user.id }, function (err, myListings) {
    if (err) throw err
    res.render('trade/selecttrade.ejs', { data: myListings, userID: req.params.userID, listingID: req.params.listingID })
  })
})

router.get('/:tradeID', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID })
    .populate('proposer_user_id', 'local.username')
    .populate('proposer_listing_id', 'name')
    .populate('proposee_user_id', 'local.username')
    .populate('proposee_listing_id', 'name')
    .exec(function (err, thisTrade) {
      if (err) throw err
      res.render('trade/trade', { data: thisTrade })
    })
})

router.get('/offers/:tradeID', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID })
    .populate('proposer_user_id', 'local.username')
    .populate('proposer_listing_id', 'name')
    .populate('proposee_user_id', 'local.username')
    .populate('proposee_listing_id', 'name')
    .exec(function (err, thisTrade) {
      if (err) throw err
      Chat.findOne({
        proposer_user_id: thisTrade.proposer_user_id,
        proposee_user_id: thisTrade.proposee_user_id,
        listing_id: thisTrade.proposee_listing_id
      }, function (err, thisChat) {
        if (err) throw err
        res.render('trade/receivedoffer', { thisTrade: thisTrade, thisChat: thisChat })
      })
    })
})

router.get('/offered/:tradeID', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID })
    .populate('proposer_user_id', 'local.username')
    .populate('proposer_listing_id', 'name')
    .populate('proposee_user_id', 'local.username')
    .populate('proposee_listing_id', 'name')
    .exec(function (err, thisTrade) {
      if (err) throw err
      Chat.findOne({
        proposer_user_id: thisTrade.proposer_user_id,
        proposee_user_id: thisTrade.proposee_user_id,
        listing_id: thisTrade.proposee_listing_id
      }, function (err, thisChat) {
        if (err) throw err
        res.render('trade/madeoffer', { thisTrade: thisTrade, thisChat: thisChat })
      })
    })
})

router.post('/', function (req, res) {
  var newTrade = new Trade({
    proposer_user_id: req.user._id,
    proposer_listing_id: req.body.proposerListingID,
    proposee_user_id: req.body.proposeeUserID,
    proposee_listing_id: req.body.proposeeListingID,
    listdate: Date.now(),
    status: 'Pending'
  })
  newTrade.save()

  Chat.findOne({
    proposer_user_id: newTrade.proposer_user_id,
    proposee_user_id: newTrade.proposee_user_id,
    listing_id: newTrade.proposee_listing_id
  }, function (err, thisChat) {
    if (err) throw err

    Listing.findOne({ _id: newTrade.proposer_listing_id })
    .populate('user_id', 'username')
    .exec(function (err, proposerListing) {
      Listing.findOne({ _id: newTrade.proposee_listing_id })
      .populate('user_id', 'username')
      .exec(function (err, proposeeListing) {
        if (err) throw err

        var newMessage = new Message({
          message: 'Hi, I would like to trade my ' + proposerListing.name + ' for your ' + proposeeListing.name,
          chat_id: '',
          user_id: req.user._id,
          messagedate: Date.now()
        })
        if (thisChat) {
          newMessage.chat_id = thisChat._id

          newMessage.save()
          thisChat.messages.push(newMessage._id)
          thisChat.save()
          res.redirect('/chats/mychats/' + thisChat._id)
        } else {
          var newChat = new Chat({
            proposer_user_id: req.user._id,
            proposee_user_id: req.body.proposeeUserID,
            listing_id: req.body.proposeeListingID,
            messages: []
          })

          newMessage.chat_id = newChat._id

          newMessage.save()
          newChat.messages.push(newMessage._id)
          newChat.save()
          res.redirect('/chats/mychats/' + newChat._id)
        }
      })
    })
  })
})

router.put('/reject/:tradeID', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID }, function (err, foundTrade) {
    if (err) throw err

    foundTrade.status = 'Rejected'
    foundTrade.save()

    Chat.findOne({
      proposer_user_id: foundTrade.proposer_user_id,
      proposee_user_id: foundTrade.proposee_user_id,
      listing_id: foundTrade.proposee_listing_id
    }, function (err, thisChat) {
      if (err) throw err

      Listing.findOne({ _id: foundTrade.proposer_listing_id })
      .populate('user_id', 'username')
      .exec(function (err, proposerListing) {
        Listing.findOne({ _id: foundTrade.proposee_listing_id })
        .populate('user_id', 'username')
        .exec(function (err, proposeeListing) {
          if (err) throw err

          var newMessage = new Message({
            message: req.user.local.username + ' has rejected the offer of ' + proposerListing.name + ' for ' + proposeeListing.name,
            chat_id: thisChat._id,
            user_id: req.user._id,
            messagedate: Date.now()
          })
          newMessage.save()

          res.redirect('/chats/mychats/' + thisChat._id)
        })
      })
    })
  })
})

router.put('/accept/:tradeID', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID }, function (err, foundTrade) {
    if (err) throw err

    foundTrade.status = 'Accepted'
    foundTrade.save()

    Chat.findOne({
      proposer_user_id: foundTrade.proposer_user_id,
      proposee_user_id: foundTrade.proposee_user_id,
      listing_id: foundTrade.proposee_listing_id
    }, function (err, thisChat) {
      if (err) throw err

      Listing.findOne({ _id: foundTrade.proposer_listing_id })
      .populate('user_id', 'username')
      .exec(function (err, proposerListing) {
        Listing.findOne({ _id: foundTrade.proposee_listing_id })
        .populate('user_id', 'username')
        .exec(function (err, proposeeListing) {
          if (err) throw err

          var newMessage = new Message({
            message: req.user.local.username + ' has accepted the offer of ' + proposerListing.name + ' for ' + proposeeListing.name,
            chat_id: thisChat._id,
            user_id: req.user._id,
            messagedate: Date.now()
          })
          newMessage.save()

          res.redirect('/chats/mychats/' + thisChat._id)
        })
      })
    })
  })
})

router.put('/pending/:tradeID', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID }, function (err, trade) {
    if (err) throw err
    trade.status = 'Pending'
    trade.save()
    res.redirect('/trades/offers')
  })
})

module.exports = router
