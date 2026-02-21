const Booking = require('../models/Booking')
const booking = require('../models/Booking')
const Event = require('../models/Event')


exports.createBooking = async (req, res) => {
    try {
        const { eventId, numberOfSeats } = req.body
        const userId = req.user.id
        if (!eventId || numberOfSeats === undefined) {
            return res.status(404).json({
                success: false,
                message: "EventId and Number of seats are required"
            })
        }

        if (numberOfSeats <= 0) {
            return res.status(400).json({
                success: false,
                message: "Number of seats must be greaterthan 0"
            })
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }

        if (event.availableSeats < numberOfSeats) {
            return res.status(400).json({
                success: false,
                message: "Not enough seats available"
            })
        }

        const totalAmount = event.price * numberOfSeats;

        event.availableSeats -= numberOfSeats;
        await event.save();


        const newBooking = new booking({
            user: userId,
            event: eventId,
            numberOfSeats,
            totalAmount
        })

        const savedBooking = await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Booking event successfully",
            data: savedBooking
        })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

exports.getUserBooking = async (req, res) => {
    try {

        userId = req.user.id
        const bookings = await Booking.find({ user: userId })
            .populate('event', 'title date venue price')
            .sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            count: booking.length,
            data: bookings
        })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

exports.getAllBookings = async (req, res) => {
    try {
         const bookings=await Booking.find()
         .populate('user','name email')
         .populate('event','title date venue')
         .sort({ createdAt:-1 })
         res.status(200).json({
            success:true,
             count: booking.length,
            data:bookings
         })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}
exports.getOneBooking=async(req,res)=>{
    try {
       const  id=req.params.id;
       
       const booking= await Booking.findById(id)
       .populate('user','name email')
       .populate('event','title date venue price')

       if(!booking){
        return res.status(404).json({
            success:false,
            message:"Booking not found"
        })
       }

       if(
        booking.user._id.toString()!== req.user.id &&
        req.user.role !=="admin"
       ){
        return res.status(403).json({
            success:false,
            message:"Access denied"
        })
       }
       res.status(200).json({
        success:true,
        data:booking
       })
    } catch (error) {
          console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

exports.cancelBooking=async(req,res)=>{
    try {
        const bookingId =req.params.id
        const booking = await Booking.findById(bookingId)
        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            })
        }

        if(
            booking.user.toString() !==req.user.id &&
            req.user.role !== "admin"
        ){
            return res.status(403).json({
                success:false,
                message:"Access denied"
            })
        }

        if(booking.bookingStatus === "cancelled"){
            return res.status(400).json({
                success:false,
                message:"Booking already cancelled"
            })
        }

        const event = await Event.findById(booking.event)

        event.availableSeats += booking.numberOfSeats
        await event.save()

        booking.bookingStatus = "cancelled"
        await booking.save()

        res.status(200).json({
            success:true,
            message:"Booking cancelled successfully"
        })
    } catch (error) {
                console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}