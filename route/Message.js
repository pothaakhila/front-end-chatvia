const express = require('express');
const router = express.Router();
const upload = require('./upload'); // Adjust path as needed
const Message = require('./models/Message');

// Route to handle file upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ fileUrl: `/uploads/${req.file.filename}` });
});

// Route to handle sending a message
router.post('/sendmessage', async (req, res) => {
  const { content, sender, conversationId, fileUrl, imageUrl } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  try {
    const newMessage = new Message({
      content,
      sender,
      conversationId,
      fileUrl,
      imageUrl,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message' });
  }
});

module.exports = router;



// Mock database call
const getUsersFromDatabase = () => {
    return [
      {
        _id: 'user1',
        name: 'John Doe',
        profile_photo_url: 'https://example.com/profile1.jpg',
        lastMessage: 'Hello there!',
        unread: 3,
        time: '12:30 PM',
      },
      {
        _id: 'user2',
        name: 'Jane Smith',
        profile_photo_url: 'https://example.com/profile2.jpg',
        lastMessage: 'How are you?',
        unread: 0,
        time: '10:15 AM',
      },
    ];
  };
  
  router.get('/api/get-users', (req, res) => {
    try {
      const users = getUsersFromDatabase(); // Replace with actual database call
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
  module.exports = router;


  router.post('/sendmessage', async (req, res) => {
    const { content, sender, receiver, fileUrl, imageUrl } = req.body;
  
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }
  
    try {
      await sendMessage(sender, receiver, content, fileUrl, imageUrl);
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message' });
    }
  });
  