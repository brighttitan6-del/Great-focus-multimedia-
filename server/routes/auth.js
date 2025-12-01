import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: req.body.email.includes('admin') // Simple admin check logic
    });

    const user = await newUser.save();
    
    // Generate Token immediately upon registration
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong credentials!");

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;