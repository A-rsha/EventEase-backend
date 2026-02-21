const express =require('express');
const paymentController =require('../controllers/paymentController')
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware')
const router=express.Router();

router.post('/createPayment',authMiddleware,roleMiddleware('user'),paymentController.createPayment)
router.get('/getMyPayments',authMiddleware,roleMiddleware('user'),paymentController.getUserPayment)
router.get('/getAllPayments',authMiddleware,roleMiddleware('admin'),paymentController.getAllPayments)

module.exports=router;