var express = require('express')
var router = express.Router()
var Listing = require('../models/listing')
var Trade = require('../models/trade')

router.get('/', function (req, res) {
  Listing.find({ availability: true })
  .populate('user_id', 'local.username')
  .exec(function (err, allListings) {
    if (err) throw err
    res.render('listing/index', {
      data: allListings,
      header: 'Available Books'})
  })
})
.get('/mylistings', function (req, res) {
  Listing.find({ user_id: req.user._id })
  .populate('user_id', 'local.username')
  .exec(function (err, myListings) {
    if (err) throw err
    res.render('listing/index', {
      data: myListings,
      header: 'My Books'
    })
  })
})
.get('/:listingID', function (req, res) {
  Listing.findOne({ _id: req.params.listingID }, function (err, foundListing) {
    if (err) throw err

    if (foundListing.user_id === req.user._id) {
      Trade.find({ proposee_listing_id: req.params.listingID })
      .populate('proposer_user_id', 'local.username')
      .populate('proposer_listing_id')
      .populate('proposee_user_id', 'local.username')
      .populate('proposee_listing_id')
      .exec(function (err, offeredTrades) {
        if (err) throw err
        res.render('listing/listing', {
          data: foundListing,
          offeredTrades: offeredTrades,
        })
      })
    } else {
      Trade.find({ proposee_listing_id: req.params.listingID })
      .populate('proposer_user_id', 'local.username')
      .populate('proposer_listing_id')
      .populate('proposee_user_id', 'local.username')
      .populate('proposee_listing_id')
      .exec(function (err, offeredTrades) {
        if (err) throw err
        res.render('listing/listing', {
          data: foundListing,
          offeredTrades: offeredTrades
        })
      })
    }
  })
  // ENTER VALIDATION. If owner is the user, show the owner options (Toggle available, delete). If not, (send message, offer trade)
})
.get('/:listingID/edit', function (req, res) {
  Listing.findOne({ _id: req.params.listingID }, function (err, foundListing) {
    if (err) throw err
    res.render('listing/edit', { data: foundListing })
  })
})

router.post('/', function (req, res) {
  var newListing = new Listing({
    name: req.body.listing.name,
    description: req.body.listing.description,
    listdate: Date.now(),
    availability: true,
    user_id: req.user._id
  })
  newListing.save()
  res.redirect('/listings/mylistings')
})

router.put('/:listingID/available', function (req, res) {
  Listing.findOne({ _id: req.params.listingID }, function (err, listing) {
    if (err) throw err
    listing.availability = true
    listing.save()
    res.redirect('/listings/mylistings')
  })
})

router.put('/:listingID/unavailable', function (req, res) {
  Listing.findOne({ _id: req.params.listingID }, function (err, listing) {
    if (err) throw err
    listing.availability = false
    listing.save()
    res.redirect('/listings/mylistings')
  })
})

router.delete('/:listingID', function (req, res) {
  Listing.remove({ _id: req.params.listingID }, function (err, result) {
    if (err) throw err
    res.redirect('/listings/mylistings')
  })
})

module.exports = router
