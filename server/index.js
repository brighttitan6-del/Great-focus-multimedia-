const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const serviceRoute = require('./routes/services');
const bookingRoute = require('./routes/bookings');

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
app.use("/api/services", serviceRoute);
app.use("/api/bookings", bookingRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});