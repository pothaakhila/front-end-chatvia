const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:3030/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Call Schema
const callSchema = new mongoose.Schema({
  caller: String,
  receiver: String,
  type: String, // 'voice' or 'video'
  startTime: Date,
  endTime: Date,
  conversationId: String,
});

// Define Call Model
const Call = mongoose.model('Call', callSchema);

// Start Call Endpoint
app.post('/startCall', async (req, res) => {
  try {
    const { caller, receiver, type, conversationId } = req.body;

    // Create a new call record in the database
    const newCall = new Call({
      caller,
      receiver,
      type,
      startTime: new Date(),
      conversationId,
    });

    await newCall.save(); // Save call record to database

    res.status(200).json({ message: 'Call initiated successfully', call: newCall });
  } catch (error) {
    console.error('Error initiating call:', error); // Log error for debugging
    res.status(500).json({ message: 'Error initiating call', error: error.message });
  }
});

// End Call Endpoint
app.post('/endCall', async (req, res) => {
  try {
    const { caller, receiver, conversationId } = req.body;

    // Find and update the ongoing call record
    const ongoingCall = await Call.findOneAndUpdate(
      { caller, receiver, conversationId, endTime: { $exists: false } },
      { endTime: new Date() },
      { new: true }
    );

    if (!ongoingCall) {
      return res.status(404).json({ message: 'Ongoing call not found' });
    }

    res.status(200).json({ message: 'Call ended successfully', call: ongoingCall });
  } catch (error) {
    console.error('Error ending call:', error); // Log error for debugging
    res.status(500).json({ message: 'Error ending call', error: error.message });
  }
});

app.listen(3030, () => console.log('Server running on port 3030'));
