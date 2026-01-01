import express from 'express';
import Invoice from '../models/Invoice.js';
import Transaction from '../models/Transaction.js';
import { verifyTokenAndAdmin } from './verifyToken.js';

const router = express.Router();

// INVOICES
router.get('/invoices', verifyTokenAndAdmin, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/invoices', verifyTokenAndAdmin, async (req, res) => {
  const newInvoice = new Invoice(req.body);
  try {
    const savedInvoice = await newInvoice.save();
    res.status(200).json(savedInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/invoices/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
});

// TRANSACTIONS
router.get('/transactions', verifyTokenAndAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/transactions', verifyTokenAndAdmin, async (req, res) => {
  const newTransaction = new Transaction(req.body);
  try {
    const savedTransaction = await newTransaction.save();
    res.status(200).json(savedTransaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;