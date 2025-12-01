import express from 'express';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes with .js extension for ESM
import authRoute from '../../server/routes/auth.js';
import serviceRoute from '../../server/routes/services.js';
import bookingRoute from '../../server/routes/bookings.js';

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
const router = express.Router();

router.use('/auth', authRoute);
router.use('/services', serviceRoute);
router.use('/bookings', bookingRoute);

// Mount router at /api so it matches the frontend calls
app.use('/api', router);

// Export the handler using ESM syntax for Netlify
const slsHandler = serverless(app);
export const handler = async (event, context) => {
  // Make sure to wait for database connection before handling request
  await connectDB();
  return slsHandler(event, context);
};