const mongoose = require("mongoose");

var messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    fileUrl: { type: String,default:"" },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;