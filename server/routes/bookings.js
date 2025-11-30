const router = require('express').Router();
const Booking = require('../models/Booking');
const { verifyToken, verifyTokenAndAdmin } = require('./verifyToken');

// CREATE
router.post('/', async (req, res) => {
  // Map serviceId from frontend to service reference for DB
  const bookingData = {
     ...req.body,
     service: req.body.serviceId || req.body.service
  };
  
  const newBooking = new Booking(bookingData);
  try {
    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json("Booking has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER BOOKINGS
router.get('/find/:userId', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('service');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL BOOKINGS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('service').sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;