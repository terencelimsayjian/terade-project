var express = require('express')
var router = express.Router()
var tradeController = require('../controller/tradeController')

router.get('/', tradeController.getTrades)

router.get('/offers', tradeController.getOffers)

router.get('/offered', tradeController.getOffered)

router.get('/:userID/:listingID/selecttrade', tradeController.selectTrade)

router.get('/:tradeID', tradeController.getOneTrade)

router.post('/', tradeController.postTrade)

router.put('/reject/:tradeID', tradeController.putRejectTrade)

router.put('/accept/:tradeID', tradeController.putAcceptTrade)

router.put('/pending/:tradeID', tradeController.putPendingTrade)

router.put('/remove/:tradeID', tradeController.putRemoveTrade)

module.exports = router
