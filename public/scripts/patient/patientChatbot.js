document.addEventListener("DOMContentLoaded", async () => {
    // Verify User Logged In
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) window.location.href = "../login.html";
    //. Try to get Patient Profile to verify JWT validity
    const getPatientProfileRequest = await fetch(`/api/patient/${accountId}`);
    if (getPatientProfileRequest.status === 401 || getPatientProfileRequest.status === 403) {
        window.location.href = "../login.html";
    }

    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Hide the Disclaimer once button press
    document.getElementById("agree-tnc").addEventListener("click", () => {
        document.getElementById("disclaimerMessage").classList.add("hidden");
    });

    // Load Messages from Session Storage
    const messageHistory = JSON.parse(sessionStorage.getItem("chatbotHistory"));

    if (messageHistory) {
        for (let i = 0; i < messageHistory.length; i++) {
            if (messageHistory[i].role === "user") {
                document.getElementById("chat-container").innerHTML += `
                    <div class="self-start bg-blue-100 p-3 rounded-lg shadow">
                        <p class="text-gray-800"><strong>User:</strong> ${messageHistory[i].parts[0].text}</p>
                    </div>
                `;
            } else {
                document.getElementById("chat-container").innerHTML += `
                    <div class="self-end bg-green-100 p-3 rounded-lg shadow">
                        <p class="text-gray-800"><strong>CareBot:</strong> ${messageHistory[i].parts[0].text}</p>
                    </div>
                `;
            }
        }
    }

    // Handle Message Send
    document.getElementById("send-button").addEventListener("click", async () => {
        const userInput = document.getElementById("user-input").value;

        if (userInput === "") {
            alert("Please enter a message to send!");
            return;
        }
        
        // Clear the user input field
        document.getElementById("user-input").value = "";

        // Show the user's message on the chatbot screen
        const chatContainer = document.getElementById("chat-container");
        chatContainer.innerHTML += `
            <div class="self-start bg-blue-100 p-3 rounded-lg shadow">
                <p class="text-gray-800"><strong>User:</strong> ${userInput}</p>
            </div>
        `;

        // Set History Timestamp (User)
        const chatbotHistoryTimestamp = sessionStorage.getItem("chatbotHistoryTimestamp") ? JSON.parse(sessionStorage.getItem("chatbotHistoryTimestamp")) : [];
        chatbotHistoryTimestamp.push(new Date().getTime());
        sessionStorage.setItem("chatbotHistoryTimestamp", JSON.stringify(chatbotHistoryTimestamp));

        // Freeze the send button while the chatbot is responding
        document.getElementById("send-button").disabled = true;
        document.getElementById("send-button").classList.add("cursor-not-allowed");
        document.getElementById("send-button").innerText = "Loading...";

        // Send the message to the Backend
        const chatbotResponse = await fetch("/api/chatbot/sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                message: userInput,
                history: sessionStorage.getItem("chatbotHistory") ? JSON.parse(sessionStorage.getItem("chatbotHistory")) : [],
            }),
        });
        
        if (chatbotResponse.status === 200) {
            // Parse the response from the chatbot, and display on screen
            const chatbotResponseJson = await chatbotResponse.json();
            const response = chatbotResponseJson.response;

            chatContainer.innerHTML += `
                <div class="self-end bg-green-100 p-3 rounded-lg shadow">
                    <p class="text-gray-800"><strong>CareBot:</strong> ${response}</p>
                </div>
            `;

            // Save the chatbot history to sessionStorage
            const chatbotHistory = sessionStorage.getItem("chatbotHistory") ? JSON.parse(sessionStorage.getItem("chatbotHistory")) : [];
            chatbotHistory.push({
                role: "user",
                parts: [{ text: userInput }]
            });
            chatbotHistory.push({
                role: "model",
                parts: [{ text: response }]
            });
            sessionStorage.setItem("chatbotHistory", JSON.stringify(chatbotHistory));

            // Set History Timestamp (Model)
            const chatbotHistoryTimestamp = sessionStorage.getItem("chatbotHistoryTimestamp") ? JSON.parse(sessionStorage.getItem("chatbotHistoryTimestamp")) : [];
            chatbotHistoryTimestamp.push(new Date().getTime());
            sessionStorage.setItem("chatbotHistoryTimestamp", JSON.stringify(chatbotHistoryTimestamp));
        } else {
            alert("An error occurred while sending the message to the chatbot. Please try again later.");
        }

        // Unfreeze the send button
        document.getElementById("send-button").disabled = false;
        document.getElementById("send-button").classList.remove("cursor-not-allowed");
        document.getElementById("send-button").innerText = "Send";
    });

    // Handle Save Chat Button
    document.getElementById("save-chat").addEventListener("click", async () => {
        if (!confirm("Are you sure you want to save this chat history?")) {
            return;
        }

        // Check if the user has a currently saved history
        const retrieveChatResponse = await fetch(`/api/chatbot/history/${sessionStorage.getItem("accountId")}`);

        let history = JSON.parse(sessionStorage.getItem("chatbotHistory"));
        let historyTimestamps = JSON.parse(sessionStorage.getItem("chatbotHistoryTimestamp"));

        if (retrieveChatResponse.status !== 404) {
            // User already has a saved history
            const retrieveChatResponseJson = await retrieveChatResponse.json();
            const currentChatHistory = retrieveChatResponseJson.history;

            if (sessionStorage.getItem("chatbotHistory")) {
                history = JSON.parse(sessionStorage.getItem("chatbotHistory")).slice(currentChatHistory.length);
                historyTimestamps = JSON.parse(sessionStorage.getItem("chatbotHistoryTimestamp")).slice(currentChatHistory.length);
            }
        }

        const saveChatResponse = await fetch(`/api/chatbot/history/${sessionStorage.getItem("accountId")}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                history: history,
                historyTimestamps: historyTimestamps,
            }),
        });

        if (saveChatResponse.status === 200) {
            alert("Chat history saved successfully!");
        } else {
            alert("An error occurred while saving the chat history. Please try again later.");
        }
    });

    // Handle Load Chat Button
    document.getElementById("load-chat").addEventListener("click", async () => {
        if (!confirm("Are you sure you want to load the chat history? This will overwrite the current chat history.")) {
            return;
        }

        // Get the chat history from the Backend
        const loadChatResponse = await fetch(`/api/chatbot/history/${sessionStorage.getItem("accountId")}`, {
            method: "GET",
        });

        if (loadChatResponse.status === 200) {
            const loadChatResponseJson = await loadChatResponse.json();
            const history = loadChatResponseJson.history;
            const historyTimestamps = loadChatResponseJson.historyTimestamps;

            // Reset Session Storage
            sessionStorage.setItem("chatbotHistory", JSON.stringify(history));
            sessionStorage.setItem("chatbotHistoryTimestamp", JSON.stringify(historyTimestamps));

            // Display the chat history on the screen
            const chatContainer = document.getElementById("chat-container");
            chatContainer.innerHTML = ""; // Reset the Chat Container
            for (let i = 0; i < history.length; i++) {
                if (history[i].role === "user") {
                    chatContainer.innerHTML += `
                        <div class="self-start bg-blue-100 p-3 rounded-lg shadow">
                            <p class="text-gray-800"><strong>User:</strong> ${history[i].parts[0].text}</p>
                        </div>
                    `;
                } else {
                    chatContainer.innerHTML += `
                        <div class="self-end bg-green-100 p-3 rounded-lg shadow">
                            <p class="text-gray-800"><strong>CareBot:</strong> ${history[i].parts[0].text}</p>
                        </div>
                    `;
                }
            }
        } else if (loadChatResponse.status === 404) {
            alert("No saved history found!");
        }
    });

    // Handle Delete and Clear Chat Button
    document.getElementById("delete-chat").addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete the chat? This process is IRREVERSIBLE.")) {
            return;
        }

        // Send Delete Request to Backend
        const deleteRequest = await fetch(`/api/chatbot/history/${accountId}`, {
            method: "DELETE"
        });

        if (deleteRequest.status !== 204) {
            alert("Failed to delete chat history. Try again later.");
            return;
        }

        // Reset Session Storage
        sessionStorage.setItem("chatbotHistory", []);
        sessionStorage.setItem("chatbotHistoryTimestamp", []);

        // Delete Chat Container Info
        const chatContainer = document.getElementById("chat-container");
        chatContainer.innerHTML = "";
        chatContainer.innerHTML += `
            <div class="self-end bg-green-100 p-3 rounded-lg shadow">
                <p class="text-gray-800"><strong>CareBot:</strong> Hi! I'm CareBot, do ask me any questions you have!</p>
            </div>
        `;
    });
});