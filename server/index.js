import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './routes/auth.js';
import serviceRoute from './routes/services.js';
import bookingRoute from './routes/bookings.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// DB Connection
// Check if connection exists to avoid multiple connections in serverless hot-reloads
if (mongoose.connection.readyState === 0) {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/greatfocus';
    console.log("Attempting to connect to MongoDB...");
    
    mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => console.log("DB Connection Successfull!"))
      .catch((err) => console.log("DB Connection Error:", err));
}

// Routes
app.use("/api/auth", authRoute);
app.use("/api/services", serviceRoute);
app.use("/api/bookings", bookingRoute);

// Only listen if not running in a serverless environment (Vercel)
if (process.env.VITE_VERCEL_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}!`);
    });
}

export default app;