const Chatbot = require("../models/chatbot");

// Created by: Ethan Chew
const sendMessageToChatbot = async (req, res) => {
    try {
        const { message, history } = req.body;

        const response = await Chatbot.sendMessage(message, history ? history : []);

        res.status(200).json({
            status: "Success",
            message: "Successfully sent message to chatbot",
            response: response
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Created by: Ethan Chew
const getChatbotHistory = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (req.user.id !== patientId) {
            res.status(403).json({ 
                error: "Unauthorised",
                message: "You are not allowed to view the chatbot history for this patient."
             });
            return;
        }

        const history = await Chatbot.getChatbotHistory(patientId);

        let formattedHistory = [];
        let historyTimestamps = [];
        for (let i = 0; i < history.length; i++) {
            formattedHistory.push({
                role: history[i].MessageRole,
                parts: [{ text: history[i].MessageBody }]
            });
            historyTimestamps.push(history[i].MessageTimestamp);
        }

        res.status(200).json({
            message: "Successfully retrieved chatbot history for patient",
            history: formattedHistory,
            historyTimestamps: historyTimestamps,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Created by: Ethan Chew
const saveChatbotHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { history, historyTimestamps } = req.body;

        if (req.user.id !== patientId) {
            res.status(403).json({ 
                error: "Unauthorised",
                message: "You are not allowed to save chatbot history for this patient."
             });
            return;
        }
        for (let i = 0; i < history.length; i++) {
            await Chatbot.saveChatbotHistory(patientId, history[i].parts[0].text, history[i].role, historyTimestamps[i]);
        }

        res.status(200).json({ 
            status: "Success",
            message: "Successfully saved chatbot history"
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Created by: Ethan Chew
const updateChatbotHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { history, historyTimestamps } = req.body;

        if (req.user.id !== patientId) {
            res.status(403).json({ 
                error: "Unauthorised",
                
             });
            return;
        }

        // Get currently saved history
        const savedHistory = await Chatbot.getChatbotHistory(patientId);
        

        res.status(200).json({ message: "Successfully saved chatbot history" });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

module.exports = {
    sendMessageToChatbot,
    getChatbotHistory,
    saveChatbotHistory
};