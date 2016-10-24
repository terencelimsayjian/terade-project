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
    res.render('listings/index', { data: myListings })
  })
})
.get('/new', function (req, res) {
  res.render('listings/new')
}).get('/:id', function (req, res) {
  Listing.findOne({ _id: req.params.id }, function (err, foundListing) {
    if (err) throw err
    res.render('listings/listing', { data: foundListing })
  })
}).get('/:id/edit', function (req, res) {
  Listing.findOne({ _id: req.params.id }, function (err, foundListing) {
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
  res.redirect('/listings')
})

router.delete('/:id', function (req, res) {
  Listing.remove({ _id: req.params.id }, function (err, result) {
    if (err) throw err
    res.redirect('/listings')
  })
})

module.exports = router
