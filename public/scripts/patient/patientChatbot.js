document.addEventListener("DOMContentLoaded", async () => {
    // Hide the Disclaimer once button press
    document.getElementById("agree-tnc").addEventListener("click", () => {
        document.getElementById("disclaimerMessage").classList.add("hidden");
    });

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
});