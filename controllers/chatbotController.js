const Chatbot = require("../models/chatbot");

// Created by: Ethan Chew
const sendMessageToChatbot = async (req, res) => {
    try {
        const { message, history } = req.body;

        const response = await Chatbot.sendMessage(message, history ? history : []);

        res.status(200).json({ 
            message: "Successfully sent message to chatbot",
            response: response
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    sendMessageToChatbot
};