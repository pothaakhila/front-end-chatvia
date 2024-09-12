const Conversation = require("../modules/Conv");

exports.setConversationId = async (req, res) => {
  const { currentUser, chatUser } = req.body;
  console.log(currentUser, chatUser);
  try {
    const conversationId = await Conversation.findOne(
      {
        participants: { $all: [currentUser, chatUser] },
      },
      { _id: 1 }
    );

    if (!conversationId) {
      const newConversationId = await Conversation.create({
        participants: [currentUser, chatUser],
      });
      return res.status(201).json(
        await Conversation.findOne(
          {
            participants: { $all: [currentUser, chatUser] },
          },
          { _id: 1 }
        )
      );
    } else return res.status(201).json(conversationId);
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

exports.getConversationId = async (req, res) => {
  const { currentUser, chatUser } = req.body;

  try {
    const conversationId = await Conversation.findOne(
      {
        participants: { $all: [currentUser, chatUser] },
      },
      { _id: 1 }
    );
    if (!conversationId)
      return res.status(410).json({ message: "Conversation Not Found!" });
    return res.status(201).json(conversationId);
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
