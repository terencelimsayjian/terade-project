var express = require('express')
var router = express.Router()
var Listing = require('../models/listing')

router.get('/', function (req, res) {
  Listing.find({ availability: true })
  .populate('user_id', 'local.username')
  .exec(function (err, allListings) {
    if (err) throw err
    res.render('listing/index', { data: allListings })
  })
}).get('/mylistings', function (req, res) {
  Listing.find({ user_id: req.user.id }, function (err, myListings) {
    if (err) throw err
    res.render('listing/mylistings', { data: myListings })
  })
})
.get('/new', function (req, res) {
  res.render('listing/new')
}).get('/:listingID', function (req, res) {
  Listing.findOne({ _id: req.params.listingID }, function (err, foundListing) {
    if (err) throw err
    res.render('listing/listing', { data: foundListing })
  })
}).get('/:listingID/edit', function (req, res) {
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
    user_id: req.user.id
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
