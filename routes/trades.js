var express = require('express')
var router = express.Router()
var Trade = require('../models/trade')
var Listing = require('../models/listing')

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
    res.render('trade/offers', { data: myOffers })
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
    res.render('trade/offered', { data: myOffered })
  })
})

router.get('/:userID/:listingID/selecttrade', function (req, res) {
  Listing.find({ user_id: req.user.id }, function (err, myListings) {
    if (err) throw err
    res.render('trade/selecttrade.ejs', { data: myListings, userID: req.params.userID, listingID: req.params.listingID })
  })
})

router.get('/:tradeID', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID }, function (err, thisTrade) {
    if (err) throw err
    res.render('trade/trade', { data: thisTrade })
  })
})

router.post('/', function (req, res) {
  var newTrade = new Trade({
    proposer_user_id: req.user.id,
    proposer_listing_id: req.body.proposerListingID,
    proposee_user_id: req.body.proposeeUserID,
    proposee_listing_id: req.body.proposeeListingID,
    listdate: Date.now(),
    status: 'Pending'
  })
  newTrade.save()
  res.redirect('/trades')
})

router.put('/:tradeID/reject', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID }, function (err, trade) {
    if (err) throw err
    trade.status = 'Rejected'
    trade.save()
    res.redirect('/trades/offered')
  })
})

router.put('/:tradeID/accept', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID }, function (err, trade) {
    if (err) throw err
    trade.status = 'Accepted'
    trade.save()
    res.redirect('/trades/offered')
  })
})

router.put('/:tradeID/pending', function (req, res) {
  Trade.findOne({ _id: req.params.tradeID }, function (err, trade) {
    if (err) throw err
    trade.status = 'Pending'
    trade.save()
    res.redirect('/trades/offered')
  })
})

router.delete('/:tradeID', function (req, res) {
  Trade.remove({ _id: req.params.tradeID }, function (err, trade) {
    if (err) throw err
    res.redirect('/trades/offered')
  })
})

module.exports = router