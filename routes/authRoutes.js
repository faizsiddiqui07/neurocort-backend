const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

router.post('/api/adminLogin', authController.login)
module.exports = router 