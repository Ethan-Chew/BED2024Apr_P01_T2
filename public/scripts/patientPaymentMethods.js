document.addEventListener("DOMContentLoaded", async () => {
    // Check if User is Logged in
    let accountId;
    if (sessionStorage.getItem('accountType') !== 'patient' && sessionStorage.getItem("accountId") === null) {
        window.location.href = '../login.html';
        return;
    }
    accountId = sessionStorage.getItem('accountId');

    // Get User Payment Methods
    // const paymentMethodsRequest = await fetch(`/api/patient/paymentMethods/${accountId}`);
    // const paymentMethodsJson = await paymentMethodsRequest.json();
    // const paymentMethods = paymentMethodsJson.paymentMethods;

    // Set the Minimum Date on Expiry Date
    document.getElementById("expiryDate").setAttribute("min", new Date().toISOString().slice(0, 7));
    
    // Handle Form Submission
    document.getElementById("addPaymentForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validate User Input
        const userInput = {
            merchant: document.getElementById("merchant").value,
            cardNumber: document.getElementById("cardNumber").value,
            expiryDate: document.getElementById("expiryDate").value,
            cardHolderName: document.getElementById("cardHolderName").value,
        };

        if (userInput.cardNumber.length !== 16 || Number.isNaN(value)) {
            document.getElementById("error-text").innerText = "Invalid Card Number. Please enter a valid 16-digit card number.";
            return;
        }

        // Make POST Request
        
    });

    /*
    <div class="bg-gray-100 p-4 rounded-lg shadow-lg flex justify-between items-center flex-grow">
        <div>
            <p class="font-bold text-gray-700">**** **** **** 1121</p>
            <p class="text-gray-500">Expiry Date: 05/2025</p>
            <p class="text-gray-500">Card Holder: John Doe</p>
        </div>
        <div class="flex space-x-2">
            <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Edit</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
        </div>
    </div>
    */
});