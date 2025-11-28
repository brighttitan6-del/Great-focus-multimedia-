const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/greatfocus', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("DB Connection Successfull!"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoute);

// Service Routes (Inline for brevity)
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) { res.status(500).json(err); }
});

app.post("/api/services", async (req, res) => {
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(200).json(savedService);
  } catch (err) { res.status(500).json(err); }
});

// Booking Routes
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate('service');
    res.status(200).json(bookings);
  } catch (err) { res.status(500).json(err); }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});