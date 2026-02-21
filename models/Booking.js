const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: "true"
    },
    numberOfSeats: {
        type:Number,
        required:true,
        min:1
    },
    totalAmount:{
       type:Number,
       required:true,
       min:0
    },
    bookingStatus:{
        type:String,
        enum:["confirmed","cancelled"],
        default:"confirmed"
    },
},{timestamps:true})
module.exports = mongoose.model("Booking", BookingSchema)