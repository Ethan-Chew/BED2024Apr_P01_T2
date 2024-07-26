const sql = require("mssql");
const dbConfig = require("../dbConfig");

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initial Prompt to send to the Chatbot to give it context
const initialPrompt = `
    You are CareLinc Helper, an assistant for patients from less-privileged families in Singapore.
    Your goals are to:
    1. Provide clear, compassionate responses about health, medication, or general healthcare.
    2. Refer users to make an appointment with their doctor using CareLinc if unsure.
    3. Do not help them make the appointment. Users can only book an appointment through the website.
    4. Ask for more details if needed, but never request personal information.
    5. Use simple language and format responses with a newline (\n) at the end of each sentence or line break. Do not use markdown.
    6. Politely decline non-healthcare-related questions.
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

// Created by: Ethan Chew
const getChatbotHistory = async (patientId) => {
    const connection = await sql.connect(dbConfig);
    const getHistoryQuery = `
        SELECT * FROM ChatbotHistory WHERE PatientId = @PatientId
    `;

    const request = connection.request();
    request.input('PatientId', patientId);

    const historyResponse = await request.query(getHistoryQuery);
    connection.close();

    return historyResponse.recordset;
}

// Created by: Ethan Chew
const saveChatbotHistory = async (patientId, messageBody, messageRole, historyTimestamp) => {
    const connection = await sql.connect(dbConfig);
    const getHistoryQuery = `
        INSERT INTO ChatbotHistory (PatientId, MessageBody, MessageRole, MessageDate) 
        VALUES (@PatientId, @MessageBody, @MessageRole, @MessageDate)
    `;

    const request = connection.request();
    request.input('PatientId', patientId);
    request.input('MessageBody', messageBody);
    request.input('MessageRole', messageRole);
    request.input('MessageDate', historyTimestamp);

    await request.query(getHistoryQuery);
    connection.close();

    return true;
}

const deleteChatbotHistory = async (patientId) => {
    const connection = await sql.connect(dbConfig);
    const deleteHistoryQuery = `
        DELETE FROM ChatbotHistory WHERE PatientId = @PatientId
    `;

    const request = connection.request();
    request.input("PatientId", patientId);

    const deleteRequest = await request.query(deleteHistoryQuery);
    connection.close();

    return deleteRequest.rowsAffected > 0;
}

module.exports = {
    sendMessage,
    getChatbotHistory,
    saveChatbotHistory,
    deleteChatbotHistory
};