
import express from 'express';
import Project from '../models/Project.js';
import { verifyToken, verifyTokenAndAdmin } from './verifyToken.js';

const router = express.Router();

// CREATE (Admin only usually, or system generated from booking)
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProject = new Project(req.body);
  try {
    const savedProject = await newProject.save();
    res.status(200).json(savedProject);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json("Project has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER PROJECTS (By email for simplicity in this concept)
router.get('/find', verifyToken, async (req, res) => {
  const email = req.query.email;
  try {
    // Users can only see their own projects unless admin
    if (!req.user.isAdmin && req.user.email !== email) {
        return res.status(403).json("Access denied");
    }
    const projects = await Project.find({ 
        $or: [{ clientEmail: email }, { email: email }] 
    }).sort({ updatedAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL PROJECTS (Admin)
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
