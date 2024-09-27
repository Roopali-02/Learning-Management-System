const express = require('express');
const User = require('../models/User');
const router = express.Router();
const verifyToken = require('../middleWares/auth');

router.get('/', verifyToken, async (req, res) => {
  try {
    // Fetch the user from the database using the ID from the token
    const user = await User.findById(req.user.user.id).select('-password'); // Omit the password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Respond with the user-specific data
    res.json({ user: req.user.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
  // res.json({ user: req.user.user});
});

module.exports = router;