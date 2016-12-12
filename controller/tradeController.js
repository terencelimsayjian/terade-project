var Trade = require('../models/trade')
var Listing = require('../models/listing')
var Chat = require('../models/chat')
var Message = require('../models/message')

var tradeController = {
  getTrades: function (req, res) {
    Trade.find({})
      .populate('proposer_user_id', 'local.username')
      .populate('proposer_listing_id')
      .populate('proposee_user_id', 'local.username')
      .populate('proposee_listing_id')
      .exec(function (err, allTrades) {
        if (err) throw err
        res.render('trade/index', {
          data: allTrades,
          header: 'All Trades'
        })
      })
  },

  getOffers: function (req, res) {
    Trade.find({ proposee_user_id: req.user.id, status: 'Pending' })
    .populate('proposer_user_id', 'local.username')
    .populate('proposer_listing_id')
    .populate('proposee_user_id', 'local.username')
    .populate('proposee_listing_id')
    .exec(function (err, myOffers) {
      if (err) throw err
      res.render('trade/index', {
        data: myOffers,
        header: 'Received Offers'
      })
    })
  },

  getOffered: function (req, res) {
    Trade.find({ proposer_user_id: req.user.id, status: 'Pending' })
    .populate('proposer_user_id', 'local.username')
    .populate('proposer_listing_id')
    .populate('proposee_user_id', 'local.username')
    .populate('proposee_listing_id')
    .exec(function (err, myOffered) {
      if (err) throw err
      res.render('trade/index', {
        data: myOffered,
        header: 'Made Offers'
      })
    })
  },

  selectTrade: function (req, res) {
    Listing.find({ user_id: req.user.id }, function (err, myListings) {
      if (err) throw err
      res.render('trade/selecttrade.ejs', { data: myListings, userID: req.params.userID, listingID: req.params.listingID })
    })
  },

  getOneTrade: function (req, res) {
    Trade.findOne({ _id: req.params.tradeID })
      .populate('proposer_user_id', 'local.username')
      .populate('proposer_listing_id')
      .populate('proposee_user_id', 'local.username')
      .populate('proposee_listing_id')
      .exec(function (err, thisTrade) {
        if (err) throw err
        Chat.findOne({
          proposer_user_id: thisTrade.proposer_user_id,
          proposee_user_id: thisTrade.proposee_user_id,
          listing_id: thisTrade.proposee_listing_id
        }, function (err, thisChat) {
          if (String(req.user._id) === String(thisTrade.proposee_user_id._id)) {
            if (err) throw err
            res.render('trade/receivedoffer', {
              thisTrade: thisTrade,
              thisChat: thisChat
            })
          } else if (String(req.user._id) === String(thisTrade.proposer_user_id._id)) {
            res.render('trade/madeoffer', {
              thisTrade: thisTrade,
              thisChat: thisChat
            })
          }
        })
      })
  },

  postTrade: function (req, res) {
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
      .populate('user_id', 'local.username')
      .exec(function (err, proposerListing) {
        if (err) throw err
        Listing.findOne({ _id: newTrade.proposee_listing_id })
        .populate('user_id', 'local.username')
        .exec(function (err, proposeeListing) {
          if (err) throw err

          var newMessage = new Message({
            message: proposerListing.user_id.local.username + ' has offered you ' + proposerListing.name + ' for ' + proposeeListing.name,
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
  },

  putRejectTrade: function (req, res) {
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
          if (err) throw err
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
  },

  putAcceptTrade: function (req, res) {
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
          if (err) throw err
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
  },

  putPendingTrade: function (req, res) {
    Trade.findOne({ _id: req.params.tradeID }, function (err, trade) {
      if (err) throw err
      trade.status = 'Pending'
      trade.save()
      res.redirect('/trades/' + req.params.tradeID)
    })
  },

  putRemoveTrade: function (req, res) {
    Trade.findOne({ _id: req.params.tradeID }, function (err, foundTrade) {
      if (err) throw err

      Chat.findOne({
        proposer_user_id: foundTrade.proposer_user_id,
        proposee_user_id: foundTrade.proposee_user_id,
        listing_id: foundTrade.proposee_listing_id
      }, function (err, thisChat) {
        if (err) throw err

        Listing.findOne({ _id: foundTrade.proposer_listing_id })
        .populate('user_id', 'username')
        .exec(function (err, proposerListing) {
          if (err) throw err
          Listing.findOne({ _id: foundTrade.proposee_listing_id })
          .populate('user_id', 'username')
          .exec(function (err, proposeeListing) {
            if (err) throw err

            var newMessage = new Message({
              message: req.user.local.username + ' has removed the offer of ' + proposerListing.name + ' for ' + proposeeListing.name,
              chat_id: thisChat._id,
              user_id: req.user._id,
              messagedate: Date.now()
            })
            newMessage.save()

            res.redirect('/chats/mychats/' + thisChat._id)

            foundTrade.remove()
            foundTrade.save()
          })
        })
      })
    })
  }

}

module.exports = tradeController
