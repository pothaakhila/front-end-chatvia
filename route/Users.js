const express = require("express");
const router = express.Router();
const User = require("../modules/Users"); // Adjust path as needed

// Route to fetch users
router.get('/api/get-users', async (req, res) => {
  try {
    const users = await User.find({}, 'name profile_photo_url lastMessage');
    res.json({ users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
