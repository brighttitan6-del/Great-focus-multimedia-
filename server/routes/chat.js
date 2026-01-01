import express from 'express';
import Conversation from '../models/Conversation.js';
import { verifyTokenAndAdmin } from './verifyToken.js';

const router = express.Router();

// GET ALL CONVERSATIONS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ updatedAt: -1 });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE OR UPDATE CONVERSATION (Simulated message send)
router.post('/message', verifyTokenAndAdmin, async (req, res) => {
  const { conversationId, text, sender } = req.body;
  
  try {
    const newMessage = {
      id: `m-${Date.now()}`,
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { 
        $push: { history: newMessage },
        $set: { lastMessage: text, time: 'Just now' }
      },
      { new: true }
    );
    res.status(200).json(updatedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// INITIALIZE DEMO DATA
router.post('/init', async (req, res) => {
    // Only for demo purposes to populate DB
    try {
        const count = await Conversation.countDocuments();
        if (count === 0) {
            await Conversation.insertMany([
                {
                    name: 'TechMalawi',
                    avatar: 'T',
                    color: 'bg-blue-600',
                    phone: '265999123456',
                    project: 'Product Launch Ad',
                    status: 'online',
                    lastMessage: 'Looks great! Can we change the background music?',
                    time: 'Nov 25',
                    unread: 1,
                    history: [
                        { id: '1', sender: 'admin', text: 'Here is the first draft of the launch ad.', time: '10:00 AM' },
                        { id: '2', sender: 'client', text: 'Looks great! Can we change the background music?', time: '10:30 AM' }
                    ]
                },
                {
                    name: 'John Doe',
                    avatar: 'J',
                    color: 'bg-indigo-600',
                    email: 'john@example.com',
                    project: 'Wedding Quote',
                    status: 'offline',
                    lastMessage: 'Hi, I need a quote for my wedding in December.',
                    time: '2h ago',
                    unread: 2,
                    history: [
                        { id: '1', sender: 'client', text: 'Hi, I need a quote for my wedding in December. We will have around 200 guests.', time: '2:00 PM' }
                    ]
                }
            ]);
            res.status(200).json("Initialized");
        } else {
            res.status(200).json("Already initialized");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

export default router;