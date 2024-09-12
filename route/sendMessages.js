const User = require('./models/User');
const Message = require('./models/Message');

async function sendMessage(senderId, receiverId, messageContent, fileUrl = '', imageUrl = '') {
  const timestamp = new Date();

  // Create and save the new message
  const newMessage = new Message({
    content: messageContent,
    sender: senderId,
    conversationId: receiverId, // Adjust based on your conversation logic
    fileUrl,
    imageUrl,
  });
  await newMessage.save();

  // Update the sender's last message
  await User.findByIdAndUpdate(senderId, {
    $set: {
      'lastMessage.content': messageContent,
      'lastMessage.timestamp': timestamp,
    }
  });

  // Update the receiver's last message
  await User.findByIdAndUpdate(receiverId, {
    $set: {
      'lastMessage.content': messageContent,
      'lastMessage.timestamp': timestamp,
    }
  });
}
