document.addEventListener("DOMContentLoaded", async () => {
    let paymentMethods;
    
    // Check if User is Logged in
    let accountId;
    if (sessionStorage.getItem('accountType') !== 'patient' && sessionStorage.getItem("accountId") === null) {
        window.location.href = '../login.html';
        return;
    }
    accountId = sessionStorage.getItem('accountId');

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
            document.getElementById(`edit-${i}`).addEventListener("click", () => {
                // Set values on the Form
                document.getElementById("editMerchant").value = paymentMethods[i].merchant;
                document.getElementById("editCardNumber").value = paymentMethods[i].cardNumber;
                document.getElementById("editExpiryDate").value = paymentMethods[i].cardExpiryDate.slice(0, 7);
                document.getElementById("editCardHolderName").value = paymentMethods[i].cardName;
                document.getElementById("editPaymentMethodId").value = paymentMethods[i].id;

                // Display Form
                document.getElementById("editPopup").classList.remove("hidden");
            });

            // Handle Delete Payment Method
            document.getElementById(`delete-${i}`).addEventListener("click", async () => {
                const confirmDelete = confirm("Are you sure you want to delete this payment method?");

                if (confirmDelete) {
                    await fetch(`/api/patient/paymentMethod/${paymentMethods[i].id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });

                    alert("Payment Method Deleted Successfully");
                    document.getElementById("method-" + i).remove();
                    paymentMethods.splice(i, 1);
                }
            });
        }
    }

    // Get User Payment Methods
    try {
        const paymentMethodsRequest = await fetch(`/api/patient/paymentMethods/${accountId}`);
        if (paymentMethodsRequest.status === 401 || paymentMethodsRequest.status === 403) window.location.href = '../login.html';
        const paymentMethodsJson = await paymentMethodsRequest.json();
        paymentMethods = paymentMethodsJson.paymentMethods;
        displayPaymentMethods(paymentMethods);

        if (paymentMethods.length > 0) {
            document.getElementById("no-added-container").classList.add("hidden");
        }
    } catch (err) {
        console.error(err);
    }

    // Handle Edit Form Functions
    /// Close Form Button
    document.getElementById("closeEditForm").addEventListener("click", () => {
        document.getElementById("editPopup").classList.add("hidden");
    });
    /// Submit Form Button
    document.getElementById("editPaymentForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log(document.getElementById("editPaymentMethodId").value)
        // Validate User Input
        const userInput = {
            id: document.getElementById("editPaymentMethodId").value,
            merchant: document.getElementById("editMerchant").value,
            cardNumber: document.getElementById("editCardNumber").value,
            cardExpiryDate: document.getElementById("editExpiryDate").value,
            cardName: document.getElementById("editCardHolderName").value,
        };

        if (String(userInput.cardNumber).length !== 16 || Number.isNaN(userInput.cardNumber)) {
            document.getElementById("error-text").innerText = "Invalid Card Number. Please enter a valid 16-digit card number.";
            return;
        }

        // Make PUT Request
        const putRequest = await fetch(`/api/patient/paymentMethod/${userInput.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        });

        if (putRequest.status === 200) {
            alert("Payment Method Updated Successfully");
            const paymentMethodIndex = paymentMethods.findIndex((method) => method.id === userInput.id);
            paymentMethods[paymentMethodIndex] = userInput;
            displayPaymentMethods(paymentMethods);
            document.getElementById("editPopup").classList.add("hidden");
        } else {
            alert("Failed to update Payment Method. Please try again later.");
        }
    });

    // Set the Minimum Date on Expiry Date
    document.getElementById("expiryDate").setAttribute("min", new Date().toISOString().slice(0, 7));
    
    // Handle Form Submission
    document.getElementById("addPaymentForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validate User Input
        const userInput = {
            merchant: document.getElementById("merchant").value,
            cardNumber: String(document.getElementById("cardNumber").value),
            cardExpiryDate: document.getElementById("expiryDate").value,
            cardName: document.getElementById("cardHolderName").value,
        };

        const regex = /^\d{16}$/;
        if (regex.test(userInput.cardNumber) === false) {
            document.getElementById("error-text").innerText = "Invalid Card Number. Please enter a valid 16-digit card number.";
            return;
        }

        // Make POST Request
        const createRequest = await fetch(`/api/patient/paymentMethod/${accountId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        });

        if (createRequest.status === 201) {
            const createRequestJson = await createRequest.json();
            alert("Payment Method Created Successfully");
            paymentMethods.push(createRequestJson.paymentMethod);
            
            displayPaymentMethods(paymentMethods);

            // Clear Form
            document.getElementById("cardNumber").value = "";
            document.getElementById("expiryDate").value = "";
            document.getElementById("cardHolderName").value = "";
        } else {
            alert("Failed to create Payment Method. Please try again later.");
        }
    });
});