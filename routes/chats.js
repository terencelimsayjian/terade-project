var express = require('express')
var router = express.Router()
var chatController = require('../controller/chatController')

router.get('/', chatController.getChats)

router.get('/mychats', chatController.getMyChats)

router.get('/mychats/:chatID', chatController.getThisChat)

router.get('/new/:ownerID/:listingID', chatController.newChatToUser)

router.post('/', chatController.postNewChat)

router.post('/mychats/:chatID', chatController.postChatToUser)

module.exports = router
