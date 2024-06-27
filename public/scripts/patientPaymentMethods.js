document.addEventListener("DOMContentLoaded", async () => {
    // Check if User is Logged in
    let accountId;
    if (sessionStorage.getItem('accountType') !== 'patient' && sessionStorage.getItem("accountId") === null) {
        window.location.href = '../login.html';
        return;
    }
    accountId = sessionStorage.getItem('accountId');

    // Get User Payment Methods
    const paymentMethodsRequest = await fetch(`/api/patient/${accountId}/paymentMethods`);
    const paymentMethodsJson = await paymentMethodsRequest.json();
    const paymentMethods = paymentMethodsJson.paymentMethods;

    if (paymentMethods.length > 0) {
        document.getElementById("no-added-container").classList.add("hidden");
    }
    
    // Display Payment Methods
    function displayPaymentMethods(paymentMethods) {
        document.getElementById("added-method-container").innerHTML = ""; // Clear the Container

        // Add Payment Methods to the Page
        for (let i = 0; i < paymentMethods.length; i++) {
            document.getElementById("added-method-container").innerHTML += `
                <div class="bg-gray-100 p-4 rounded-lg shadow-lg flex justify-between items-center flex-grow" id="method-${i}">
                    <div>
                        <p class="font-bold text-gray-700">**** **** **** ${String(paymentMethods[i].cardNumber).slice(-4)}</p>
                        <p class="text-gray-500">Expiry Date: ${paymentMethods[i].cardExpiryDate.slice(0, 7)}</p>
                        <p class="text-gray-500">Card Holder: ${paymentMethods[i].cardName}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" id="edit-${i}">Edit</button>
                        <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" id="delete-${i}">Delete</button>
                    </div>
                </div>
            `;
        }

        // Handle Payment Methods Methods
        for (let i = 0; i < paymentMethods.length; i++) {
            // Handle Edit Payment Method
            document.getElementById("edit-" + i).addEventListener("click", () => {
                // Set values on the Form
                document.getElementById("editCardNumber").value = paymentMethods[i].cardNumber;
                document.getElementById("editExpiryDate").value = paymentMethods[i].cardExpiryDate.slice(0, 7);
                document.getElementById("editCardHolderName").value = paymentMethods[i].cardName;

                // Display Form
                document.getElementById("editPopup").classList.remove("hidden");
            });

            // Handle Delete Payment Method
            document.getElementById(`delete-${i}`).addEventListener("click", async () => {
                const confirmDelete = confirm("Are you sure you want to delete this payment method?");

                if (confirmDelete) {
                    await fetch(`/api/patient/${accountId}/paymentMethods`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            cardNumber: paymentMethods[i].cardNumber,
                        }),
                    });

                    alert("Payment Method Deleted Successfully");
                    document.getElementById("method-" + i).remove();
                    paymentMethods.splice(i, 1);
                }
            });
        }
    }
    displayPaymentMethods(paymentMethods);

    // Handle Edit Form Functions
    /// Close Form Button
    document.getElementById("closeEditForm").addEventListener("click", () => {
        document.getElementById("editPopup").classList.add("hidden");
    });
    /// Submit Form Button
    document.getElementById("editPaymentForm").addEventListener("submit", async (e) => {
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

        // TODO: Make PUT Request
    });

    // Set the Minimum Date on Expiry Date
    document.getElementById("expiryDate").setAttribute("min", new Date().toISOString().slice(0, 7));
    
    // Handle Form Submission
    document.getElementById("addPaymentForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validate User Input
        const userInput = {
            patientId: sessionStorage.getItem("accountId"), // Get Patient ID from Session Storage (Logged in User
            merchant: document.getElementById("merchant").value,
            cardNumber: String(document.getElementById("cardNumber").value),
            cardExpiryDate: document.getElementById("expiryDate").value,
            cardName: document.getElementById("cardHolderName").value,
        };

        if (userInput.cardNumber.length !== 16 || Number.isNaN(userInput.cardNumber.length)) {
            document.getElementById("error-text").innerText = "Invalid Card Number. Please enter a valid 16-digit card number.";
            return;
        }

        // Make POST Request
        const createRequest = await fetch(`/api/patient/${accountId}/paymentMethods`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        });

        paymentMethods.push(userInput);
        displayPaymentMethods(paymentMethods);
    });
});