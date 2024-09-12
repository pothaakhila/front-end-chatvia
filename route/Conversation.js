const express = require("express");

const {
  getConversationId,
  setConversationId,
} = require("../controllers/ConversationControllers");
const {
  getMessages,
  sendMessage,
} = require("../controllers/MessageControllers");

const routes = express.Router();

routes.post("/getconversationid", getConversationId);
routes.post("/setconversationid", setConversationId);

routes.post("/getmessages", getMessages);

routes.post("/sendmessage", sendMessage);

module.exports = routes;
