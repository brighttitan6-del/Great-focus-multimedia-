const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const authRoute = require('../../server/routes/auth');
const serviceRoute = require('../../server/routes/services');
const bookingRoute = require('../../server/routes/bookings');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Database Connection (Cached for Lambda)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected via Serverless");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

// Routes
// Note: We mount to /.netlify/functions/api in development, but usually we use a rewrite
// In Express on Netlify, we often mount to a router to handle the path prefix or use the router directly
const router = express.Router();

router.use('/auth', authRoute);
router.use('/services', serviceRoute);
router.use('/bookings', bookingRoute);

// Mount router at /api so it matches the frontend calls
app.use('/api', router);

// Export the handler
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Make sure to wait for database connection before handling request
  await connectDB();
  return handler(event, context);
};