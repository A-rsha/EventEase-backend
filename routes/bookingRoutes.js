const express=require('express')
const router=express.Router();
const BookingController =require('../controllers/BookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware')


router.post('/createBooking',authMiddleware,roleMiddleware('user'),BookingController.createBooking)
router.get('/myBookings',authMiddleware,roleMiddleware('user'),BookingController.getUserBooking)
router.get('/AllBookings',authMiddleware,roleMiddleware('admin'),BookingController.getAllBookings)
router.get('/getOneBooking/:id',authMiddleware,BookingController.getOneBooking)
router.put('/cancelBooking/:id',authMiddleware,BookingController.cancelBooking)
module.exports = router;