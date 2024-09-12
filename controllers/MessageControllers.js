const Message = require("../modules/Msg");

exports.sendMessage = async (req, res) => {
  const { conversationId, sender, content } = req.body;
  try {
    const newMessage = await Message.create({
      conversationId,
      sender,
      content,
    });
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { conversationId } = req.body;
  try {
    const messages = await Message.find({ conversationId: conversationId });

    return res.status(201).json(messages);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
