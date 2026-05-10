const Event = require('../models/Event');
const User = require('../models/User');
exports.createEvent = async (req, res) => {
  try {

    console.log("REQ FILE:", req.file);
    console.log("BODY:", req.body);
console.log("FILE:", req.file);

    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      price,
      totalSeats,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const newEvent = new Event({
      title,
      description,
      category,
      date,
      time,
      venue,
      price,
      totalSeats,
      availableSeats: totalSeats,

      image: req.file.path,

      createdBy: req.user.id,
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      success: true,
      data: savedEvent,
    });

  } catch (error) {

    console.log("CREATE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAllEvents = async (req, res) => {
    try {

        const events = await Event.find();

        res.status(200).json({
            success: true,
            data: events
        });

    } catch (error) {
        console.log(error);

        res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};


exports.getEventById = async (req, res) => {
    try {

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });

    } catch (error) {
        console.log(error);

        res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};


exports.updateEvent = async (req, res) => {
    try {

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent
        });

    } catch (error) {
        console.log(error);

        res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};


exports.deleteEvent = async (req, res) => {
    try {

        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(error.status || 500).json({
            error: error.message || "Internal server error"
        });
    }
};