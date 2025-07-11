const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const lastUser = await User.findOne().sort({ sNo: -1 });
    const newSNo = lastUser ? lastUser.sNo + 1 : 1;
    
    const user = new User({
      sNo: newSNo,
      username: req.body.username,
      type: req.body.type,
      phoneNo: req.body.phoneNo,
      contactPerson: req.body.contactPerson,
      panNo: req.body.panNo,
      gstinNo: req.body.gstinNo,
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ sNo: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        username: req.body.username,
        type: req.body.type,
        phoneNo: req.body.phoneNo,
        contactPerson: req.body.contactPerson,
        panNo: req.body.panNo,
        gstinNo: req.body.gstinNo,
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;