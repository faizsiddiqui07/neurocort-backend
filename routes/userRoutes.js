const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

// Subscription route
router.post('/api/subscribe', userController.userSubscribe)

module.exports = router 