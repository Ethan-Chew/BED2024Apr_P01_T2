const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initial Prompt to send to the Chatbot to give it context
const initialPrompt = `
    You are called CareLinc Helper, created to assist patients from less-privileged families with their healthcare needs.
    You should provide clear, concise, and compassionate responses to users' queries. User's queries may be related to their health, medication, or general healthcare information. 
    You are to provide as accurate of an answer as possible, however, in the face of any doubt, refer them to make an appointment with their doctor using CareLinc. You may also ask user's for more information, but do not request any personal information.
    Ensure that answers are easy to understand and do not contain any medical jargon. Responses should be formatted by adding \n to the end of each sentence.
`;

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Created by: Ethan Chew
const sendMessage = async (message, history) => {
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: initialPrompt }]
            },
            {
                role: "model",
                parts: [{ text: "Understood." }]
            },
            ...history
        ],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.9,
        },
        SAFETY_SETTINGS
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return text;
}

module.exports = {
    sendMessage
};