const express =require('express');
const eventController =require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware')
const upload = require('../middleware/upload');

const router=express.Router();

router.post('/postEvent',authMiddleware,roleMiddleware('admin'), upload.single('image'),eventController.createEvent)
router.get('/getEvents',eventController.getAllEvents)
router.get('/getEvent/:id',eventController.getEventById)
router.put('/UpdateEvent/:id',authMiddleware,roleMiddleware('admin'),eventController.updateEvent)
router.delete('/deleteEvent/:id',authMiddleware,roleMiddleware('admin'),eventController.deleteEvent)

module.exports=router;