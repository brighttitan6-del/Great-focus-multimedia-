
import express from 'express';
import PortfolioItem from '../models/PortfolioItem.js';
import { verifyTokenAndAdmin } from './verifyToken.js';

const router = express.Router();

// CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newItem = new PortfolioItem(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(200).json(savedItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await PortfolioItem.findByIdAndDelete(req.params.id);
    res.status(200).json("Item has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL
router.get('/', async (req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
