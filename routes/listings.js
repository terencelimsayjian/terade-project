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

.get('/userlistings/:userID', function (req, res) {
  Listing.find({ user_id: req.params.userID })
  .populate('user_id', 'local.username')
  .exec(function (err, myListings) {
    if (err) throw err

    if (String(req.user._id) === String(myListings[0].user_id._id)) {
      res.render('listing/mylistings', {
        data: myListings,
        header: myListings[0].user_id.local.username + "'s Books"
      })
    } else {
      res.render('listing/index', {
        data: myListings,
        header: myListings[0].user_id.local.username + "'s Books"
      })
    }
  })
})

.get('/:listingID', function (req, res) {
  Listing.findOne({ _id: req.params.listingID })
    .populate('user_id', 'local.username')
    .exec(function (err, foundListing) {
      if (err) throw err
      if (String(req.user._id) === String(foundListing.user_id._id)) {
        Trade.find({ proposee_listing_id: req.params.listingID })
        .populate('proposer_user_id', 'local.username')
        .populate('proposer_listing_id')
        .populate('proposee_user_id', 'local.username')
        .populate('proposee_listing_id')
        .exec(function (err, offeredTrades) {
          if (err) throw err
          var offers
          if (offeredTrades.length === 0) {
            offers = 'No Offers at this time'
          } else {
            offers = 'Offers:'
          }
          res.render('listing/mylisting', {
            data: foundListing,
            offeredTrades: offeredTrades,
            offers: offers
          })
        })
      } else {
        res.render('listing/otherlisting', {
          data: foundListing
        })
      }
    })
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
    res.redirect('/listings/' + req.params.listingID)
  })
})

router.put('/:listingID/unavailable', function (req, res) {
  Listing.findOne({ _id: req.params.listingID }, function (err, listing) {
    if (err) throw err
    listing.availability = false
    listing.save()
    res.redirect('/listings/' + req.params.listingID)
  })
})

router.delete('/:listingID', function (req, res) {
  Listing.remove({ _id: req.params.listingID }, function (err, result) {
    if (err) throw err
    res.redirect('/listings/mylistings')
  })
})

module.exports = router
