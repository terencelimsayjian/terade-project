var express = require('express')
var router = express.Router()
var Listing = require('../models/listing')

router.get('/', function (req, res) {
  Listing.find({}, function (err, allListings) {
    if (err) throw err
    res.render('listings/index', { data: allListings })
  })
}).get('/mylistings', function (req, res) {
  Listing.find({ user_id: req.user.id }, function (err, myListings) {
    if (err) throw err
    res.render('listings/mylistings', { data: myListings })
  })
})
.get('/new', function (req, res) {
  res.render('listings/new')
}).get('/:listingID', function (req, res) {
  Listing.findOne({ _id: req.params.listingID }, function (err, foundListing) {
    if (err) throw err
    res.render('listings/listing', { data: foundListing })
  })
}).get('/:listingID/edit', function (req, res) {
  Listing.findOne({ _id: req.params.listingID }, function (err, foundListing) {
    if (err) throw err
    res.render('listings/edit', { data: foundListing })
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

router.delete('/:listingID', function (req, res) {
  Listing.remove({ _id: req.params.listingID }, function (err, result) {
    if (err) throw err
    res.redirect('/listings/mylistings')
  })
})

module.exports = router
