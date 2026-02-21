const Event = require('../models/Event')

exports.createEvent=async(req,res)=>{
    try {
        const {title,description,date,venue,price,totalSeats}=req.body
        if(!title || !description || !date || !venue || !price || !totalSeats){
            return res.status(400).json({
            success:false,
            message:"All fields are required"
            })
        }

        const newEvent=new Event({
            title,
            description,
            date,
            venue,
            price,
            totalSeats,
            availableSeats,
            createdBy:req.user.id,image:req.file ? req.file.path:undefined
        });
        const savedEvent = await newEvent.save()
       return res.status(201).json({
        success:true,
        message:"Event added successfully",
        data:savedEvent
       })
    } catch (error) {
              console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

exports.getAllEvents=async(req,res)=>{
    try {
        const events = await Event.find();
        res.status(200).json({
            success:true,
            data:events
        })
    } catch (error) {
            console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

exports.getEventById=async(req,res)=>{
    try {
        const event =await Event.findById(req.params.id);
        
        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event not found"
            })
        }
        res.status(200).json({
            success:true,
            data:event
        })
    } catch (error) {
    console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

exports.updateEvent=async(req,res)=>{
    try {
        const updateEvent=await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true,runValidators:true}
        )
        if(!updateEvent){
            return res.status(404).json({
                success:false,
                message:"Event not found",
            })
        }
        res.json({
            success:true,
            message:"Event updated successfully",
            data:updateEvent
        })
    } catch (error) {
            console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

exports.deleteEvent=async(req,res)=>{
    try {
        const deletedEvent =await  Event.findByIdAndDelete(req.params.id)
        if(!deletedEvent){
            return res.status(404).json({
                success:false,
                message:"Event not found"
            })
        }

        res.json({
            success:true,
            message:"Event deleted scuccessfully"
        })
    } catch (error) {
            console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}
