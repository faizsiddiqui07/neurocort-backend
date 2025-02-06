const express = require('express')
const { add_service, get_service, update_service_status, delete_service, get_categorywise_service, update_categorywise_service, get_service_for_website, get_single_service_for_website } = require('../controller/serviceController')
const router = express.Router()


router.post('/api/service/add_service', add_service)
router.get('/api/allService', get_service)
router.put('/api/service/status-update/:service_id', update_service_status)
router.delete('/api/delete/:service_id', delete_service);
router.get('/api/services/:service_id', get_categorywise_service);
router.put('/api/update/:service_id', update_categorywise_service); 



// For website 
router.get('/api/allServiceForWebsite', get_service_for_website)
router.get('/api/singleService', get_single_service_for_website)



module.exports = router