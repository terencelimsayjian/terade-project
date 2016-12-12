var express = require('express')
var router = express.Router()
var listingController = require('../controller/listingController')

router.route('/')
      .get(listingController.getListings)
      .post(listingController.createListing)

router.get('/userlistings/:userID', listingController.getUserListings)

router.route('/:listingID')
      .get(listingController.getListing)
      .delete(listingController.deleteListing)

router.get('/:listingID/edit', listingController.editListing)

router.put('/:listingID/available', listingController.makeListingAvail)

router.put('/:listingID/unavailable', listingController.makeListingUnavail)

module.exports = router
