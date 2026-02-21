const payment = require('../models/payment')
const Booking = require('../models/Booking')
exports.createPayment = async (req, res) => {
    try {
        const { bookingId, paymentMethod } = req.body
        if (!bookingId || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Booking ID and payment method are required"
            })
        }

        const validMethods = ["UPI", "card", "NetBanking"]
        if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method.Allowed:UPI,Card,NetBanking"
            })
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to pay for this booking"
            })
        }

        const existingPayment = await payment.findOne({
            bookingId: bookingId,
            paymentStatus: "success"
        })

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "Payment already completed for this booking"
            })
        }


        const payments = await payment.create({
            user: req.user.id,
            bookingId: bookingId,
            amount: booking.totalAmount,
            paymentMethod: paymentMethod,
            paymentStatus: "success",
            transactionId: "TXN" + Date.now()
        })

        booking.bookingStatus = "confirmed"
        await booking.save()

        return res.status(201).json({
            success: true,
            message: "Payment successful",
            data: payments
        })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

exports.getUserPayment = async (req, res) => {
    try {
        const payments = await payment.find({
            user: req.user.id
        })
            .populate("bookingId")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}
exports.getAllPayments =async(req,res)=>{
    try {
        const payments =await payment.find()
        .populate('user','name')
        .populate('bookingId')
        .sort({  createdAt:-1 })
        res.status(200).json({
            success:true,
            count:payments.length,
            data:payments
        })
    } catch (error) {
         console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}