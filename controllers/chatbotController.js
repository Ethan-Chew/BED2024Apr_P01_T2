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

// Created by: Ethan Chew
const getChatbotHistory = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (req.user.id !== patientId) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }

        const history = await Chatbot.getChatbotHistory(patientId);

        let formattedHistory = [];
        for (let i = 0; i < history.length; i++) {
            formattedHistory.push({
                role: history[i].MessageRole,
                parts: [{ text: history[i].MessageText }]
            });
        }

        req.status(200).json({
            message: "Successfully retrieved chatbot history for patient",
            history: formattedHistory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Created by: Ethan Chew
const saveChatbotHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { history, historyTimestamps } = req.body;

        if (req.user.id !== patientId) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }

        for (let i = 0; i < history.length; i++) {
            await Chatbot.saveChatbotHistory(patientId, history[i].parts[0].text, history[i].role, historyTimestamps[i]);
        }

        res.status(200).json({ message: "Successfully saved chatbot history" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Created by: Ethan Chew
const updateChatbotHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { history, historyTimestamps } = req.body;

        if (req.user.id !== patientId) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }

        // Get currently saved history
        const savedHistory = await Chatbot.getChatbotHistory(patientId);
        

        res.status(200).json({ message: "Successfully saved chatbot history" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    sendMessageToChatbot,
    getChatbotHistory,
    saveChatbotHistory
};