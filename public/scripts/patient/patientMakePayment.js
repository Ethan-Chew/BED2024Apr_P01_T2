document.addEventListener("DOMContentLoaded", async () => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Get Patient's AccountId from Session Storage
    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) window.location.href = '../login.html';

    // Fetch Patient's Account Details
    const fetchPatientResponse = await fetch(`/api/patient/${accountId}`);
    if (fetchPatientResponse.status === 401 || fetchPatientResponse.status === 403) window.location.href = '../login.html';
    else if (fetchPatientResponse.status !== 200) {
        alert("Error Retrieving Patient Information. Please try again.");
        return;
    }
    const patientJson = await fetchPatientResponse.json();
    const patient = patientJson.patient;
    document.getElementById("email").value = patient.email;

    // Fetch Patient's Appointments
    const fetchPatientAppointmentsResponse = await fetch(`/api/appointments/patient/${accountId}`);
    if (fetchPatientAppointmentsResponse.status === 401 || fetchPatientAppointmentsResponse.status === 403) window.location.href = '../login.html';
    else if (fetchPatientAppointmentsResponse.status !== 200) {
        alert("Error Retrieving Patient Appointments. Please try again.");
        return;
    }
    const patientAppointmentsJson = await fetchPatientAppointmentsResponse.json();
    const patientAppointments = patientAppointmentsJson.appointments;
    
    // Filter to get Unpaid Appointment
    const unpaidAppointments = patientAppointments.filter(appointment => appointment.paymentStatus === 'Unpaid');

    // Get Details of Unpaid Appointments
    let unpaidAppointmentsDetail = [];
    for (let i = 0; i < unpaidAppointments.length; i++) {
        const fetchAppointmentResponse = await fetch(`/api/appointments/${unpaidAppointments[i].id}`, {
            method: 'GET'
        });
        if (fetchAppointmentResponse.status !== 200) {
            alert("Error Retrieving Appointment Information. Please try again.");
            return;
        }
        const appointmentJson = await fetchAppointmentResponse.json();
        unpaidAppointmentsDetail.push(appointmentJson.appointment);
    }

    // Get Patient's Payment Methods
    const fetchPaymentMethodsResponse = await fetch(`/api/patient/paymentMethods/${accountId}`, {
        method: 'GET'
    });

    if (fetchPaymentMethodsResponse.status !== 200) {
        alert("Error Retrieving Payment Methods. Please try again.");
        return;
    }

    const paymentMethodsJson = await fetchPaymentMethodsResponse.json();
    const paymentMethods = paymentMethodsJson.paymentMethods;

    // Pre-Load into Payment Confirmation Screen
    const paymentMethodList = document.getElementById('payment-method-list');
    for (let i = 0; i < paymentMethods.length; i++) {
        paymentMethodList.innerHTML += `
            <div class="flex items-center">
                <input type="radio" id="card${i}" name="paymentMethod" value="${String(paymentMethods[i].cardNumber).slice(-4)}" class="mr-2" ${i == 0 ? "checked" : ""}>
                <label for="card${i}" class="text-gray-700">**** **** **** ${String(paymentMethods[i].cardNumber).slice(-4)} (Expires ${paymentMethods[i].cardExpiryDate.slice(0, 7)})</label>
            </div>
        `;
    }

    // Get the User's Digital Wallet
    const digitalWalletRequest = await fetch(`/api/patient/${accountId}/digitalWallet`);
    let digitalWallet;
    if (digitalWalletRequest.status === 200) {
        const digitalWalletJson = await digitalWalletRequest.json();
        digitalWallet = digitalWalletJson.wallet;

        paymentMethodList.innerHTML += `
            <div class="flex items-center">
                <input type="radio" id="digitalWallet" name="paymentMethod" value="digitalWallet" class="mr-2">
                <label for="digitalWallet" class="text-gray-700">Digital Wallet ($${Number(digitalWallet.balance).toLocaleString()})</label>
            </div>
        `;
    }

    // If the user selects Digital Wallet, remove the CVV input. Else, add it back.
    document.querySelectorAll("input[name='paymentMethod']").forEach((input) => {
        input.addEventListener('change', () => {
            const value = input.value;
            // If the user selects Digital Wallet, remove the CVV input. Else, add it back.
            if (value === "digitalWallet") {
                document.getElementById("cvv-container").classList.add("hidden");
                document.getElementById("cvv").required = false;
            } else {
                document.getElementById("cvv-container").classList.remove("hidden");
                document.getElementById("cvv").required = true;
            }
        });
    });

    // Display Unpaid Appointments on the Screen
    const paymentListContainer = document.getElementById('paymentlist-container');
    if (unpaidAppointmentsDetail.length === 0) document.getElementById('no-outstanding').classList.remove('hidden');
    for (let i = 0; i < unpaidAppointmentsDetail.length; i++) {
        const appointment = unpaidAppointmentsDetail[i];
        let totalAmount = appointment.consultationCost;

        paymentListContainer.innerHTML += `
            <div class="bg-white shadow-md rounded-lg mb-4 p-4" id="payment-${i}-container">
                <div class="border-b">
                    <h2 class="text-2xl font-semibold mb-2">Invoice Details (${appointment.slotDate.split("T")[0]})</h2>
                </div>
                <div class="flex flex-row mt-4">
                    <div class="flex flex-col flex-grow space-y-2" id="payment-med-${i}"></div>
                    <div class="flex flex-col space-y-2 items-end" id="payment-med-cost-${i}"></div>
                </div>
                <div class="flex flex-row align-center my-4">
                    <div class="flex flex-col space-y-2 items-start">
                        <a class="text-right">
                            <b>Total Amount:</b> $<span id="payment-${i}-totalcost"></span>
                        </a>
                        <div id="payment-${i}-approved-paymentreq" class="hidden flex flex-col space-y-2 items-start">
                            <a class="text-right"><b>Subsidised Amount: </b> $<span id="payment-${i}-subsidised"></span></a>
                            <a class="text-right"><b>Final Amount: </b> $<span id="payment-${i}-final"></span></a> 
                        </div>
                    </div>
                    <a class="ml-auto text-sm text-gray-500" id="help-text-${i}">
                        Can't afford it now? Ask for help from a member of the public.
                    </a>
                </div>
                <div class="flex justify-end">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded mr-2" id="payment-${i}">Pay</button>
                    <button class="bg-gray-300 text-gray-700 px-4 py-2 rounded" id="help-${i}">Request Help</button>
                </div>
            </div>
        `;

        // Set the Text for ask help
        if (appointment.paymentRequest) {
            document.getElementById(`help-text-${i}`).innerText = `Help requested on ${appointment.paymentRequest.createdDate.split("T")[0]}. Status: ${appointment.paymentRequest.status}`;

            if (appointment.paymentRequest.status === "Pending") {
                document.getElementById(`help-${i}`).disabled = true;
                document.getElementById(`help-${i}`).classList.add('cursor-not-allowed');
            } else if (appointment.paymentRequest.status === "Approved") {
                document.getElementById(`payment-${i}-approved-paymentreq`).classList.remove('hidden');

                // Update Subsidised and Final Amounts
                document.getElementById(`payment-${i}-subsidised`).innerText = appointment.paymentRequest.helpAmount;
            }

            document.getElementById(`help-${i}`).disabled = true;
            document.getElementById(`help-${i}`).classList.add('cursor-not-allowed');
        }
        
        // Add Medication and Cost to Screen
        for (let j = 0; j < appointment.medication.length; j++) {
            document.getElementById(`payment-med-${i}`).innerHTML += `<a>${appointment.medication[j].drugName}</a>`;
            document.getElementById(`payment-med-cost-${i}`).innerHTML += `<a>$${appointment.medication[j].drugPrice}</a>`;
            if (appointment.medication[j].drugRequest === "Completed") {
                document.getElementById(`payment-med-cost-${i}`).innerHTML += `<a>$0 <i>(Company Fufilled)</i></a>`;
            } else {
                totalAmount += appointment.medication[j].drugPrice;
            }
        }

        // Add Consultation Cost to Screen
        document.getElementById(`payment-med-${i}`).innerHTML += `<a>Consultation Fee</a>`;
        document.getElementById(`payment-med-cost-${i}`).innerHTML += `<a>$${appointment.consultationCost}</a>`;

        totalAmount = Math.round(totalAmount * 100) / 100;
        document.getElementById(`payment-${i}-totalcost`).innerText = totalAmount; // Set total cost amount

        if (appointment.paymentRequest) {
            if (appointment.paymentRequest.status === "Approved") {
                totalAmount -= appointment.paymentRequest.helpAmount;
                document.getElementById(`payment-${i}-final`).innerText = totalAmount;
            }
        }
    }

    for (let i = 0; i < unpaidAppointmentsDetail.length; i++) {
        const appointment = unpaidAppointmentsDetail[i];

        // Set Event Listeners for Payment Buttons
        document.getElementById(`payment-${i}`).addEventListener('click', async () => {
            // Check if the User has a Pending Payment Request
            if (appointment.paymentRequest) {
                const confirmPayment = confirm("You have a pending Payment Help Request. Are you sure you want to make this payment? The request will be cancelled.");
                if (!confirmPayment) return;

                // Delete Payment Help Request
                const deletePaymentRequestResponse = await fetch(`/api/paymentRequest/${appointment.paymentRequest.id}`, {
                    method: 'DELETE'
                });

                if (deletePaymentRequestResponse.status === 201) {
                    alert("Payment Request Cancelled.");
                    unpaidAppointmentsDetail[i].paymentRequest = null;
                    document.getElementById(`help-text-${i}`).innerText = `Can't afford it now? Ask for help from a member of the public.`;
                    document.getElementById(`help-${i}`).disabled = false;
                    document.getElementById(`help-${i}`).classList.remove('cursor-not-allowed');
                } else {
                    alert("Failed to cancel Payment Request.");
                    return;
                }
            }
            // Send Text to Payment Confirmation Popup
            document.getElementById('payment-amount').innerText = document.getElementById(`payment-${i}-totalcost`).innerText;
            if (appointment.paymentRequest) {
                if (appointment.paymentRequest.status === "Approved") {
                    document.getElementById('payment-amount').innerText = document.getElementById(`payment-${i}-final`).innerText;
                }
            }
            document.getElementById('appointment-date').value = appointment.slotDate;
            document.getElementById('appointment-time').value = appointment.slotTime;
            document.getElementById('appointment-id').value = appointment.appointmentId;
            document.getElementById('appointment-i').value = i;

            // Display Payment Confirmation Popup
            document.getElementById('make-payment-popup').classList.remove('hidden');
        });

        // Set Event Listeners for Help Buttons
        document.getElementById(`help-${i}`).addEventListener('click', async () => {
            // Display Help Popup
            document.getElementById('help-appt-id').value = appointment.appointmentId;
            document.getElementById('reqHelpPopup').classList.remove('hidden');
    
            // Handle Submit Help Request
            document.getElementById('submit-help').addEventListener('click', async () => {
                const helpReason = document.getElementById('help-reason').value;
                
                const helpRequestResponse = await fetch('/api/paymentRequest', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        appointmentId: appointment.appointmentId,
                        message: helpReason,
                        createdDate: new Date().toISOString()
                    })
                });
    
                if (helpRequestResponse.status === 201) {
                    alert("Help Request Sent. Please wait for approval.");
                    document.getElementById('reqHelpPopup').classList.add('hidden');
    
                    // Set Text for Help Request
                    document.getElementById(`help-text-${i}`).innerText = `Help requested on ${new Date().toISOString().split("T")[0]}. Status: Pending`;
                    document.getElementById(`help-${i}`).disabled = true;
                    document.getElementById(`help-${i}`).classList.add('cursor-not-allowed');
                } else {
                    alert("Error Sending Help Request. Please try again.");
                }
            });
    
            // Handle Close Popup
            document.getElementById('cancel-help').addEventListener('click', () => {
                document.getElementById('reqHelpPopup').classList.add('hidden');
            });
        });
    }

    // Handle Close Confirm Payment Popup
    document.getElementById('close-payment-popup').addEventListener('click', () => {
        document.getElementById('make-payment-popup').classList.add('hidden');
    });

    // Handle Payment Confirmation Submission
    document.getElementById('paymentForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get Selected Payment Method
        const cardVal = document.querySelector('input[name="paymentMethod"]:checked').value;
        let cardMerchant = "Digital Wallet";

        if (!cardVal) {
            alert("Please select a payment method.");
            return;
        }

        if (cardVal === "digitalWallet") {
            // Check if the User's Digital Wallet has Sufficient Balance
            if (digitalWallet.balance < Number(document.getElementById("payment-amount").innerText)) {
                alert("Insufficient Balance in Digital Wallet. Choose another payment method!");
                return;
            }

            // Deduct Payment from Digital Wallet
            const deductFromWallet = await fetch(`/api/patient/${accountId}/digitalWallet`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    updateAmount: -Number(document.getElementById("payment-amount").innerText)
                })
            });

            if (deductFromWallet.status !== 200) {
                alert("Failed to deduct funds from wallet. Please try again later.");
                return;
            }

            // Send Transaction History
            const updateWalletHistoryRequest = await fetch(`/api/patient/${accountId}/digitalWalletHistory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: `Payment for Appointment on ${document.getElementById('appointment-date').value.split("T")[0]}`, amount: -Number(document.getElementById("payment-amount").innerText) }),
            });

            if (updateWalletHistoryRequest.status !== 201) {
                alert("Failed to deduct funds from wallet. Please try again later.");
                return;
            }
        } else {
            cardMerchant = paymentMethods.find(method => String(method.cardNumber).slice(-4) === cardVal).merchant;
        }

        // Send Payment Paid Request
        const makePaymentRequest = await fetch('/api/patient/makePayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentId: document.getElementById('appointment-id').value,
                paymentMethod: cardMerchant === "Digital Wallet" ? "DWallet" : "Card",
            })
        });

        if (makePaymentRequest.status !== 200) {
            alert("Error Making Payment. Please try again.");
            return;
        }

        // Send Payment Confirmation Email
        const sendConfirmationEmail = await fetch('/api/mail/paymentConfirmation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recepient: document.getElementById("email").value,
                cardMerchant: cardMerchant,
                cardLFDigits: cardVal,
                paymentAmount: Number(document.getElementById("payment-amount").innerText),
                appointmentDate: document.getElementById('appointment-date').value.split("T")[0],
                appointmentTime: document.getElementById('appointment-time').value,
            })
        });

        if (sendConfirmationEmail.status !== 201) {
            alert("Error Sending Confirmation Email. Please try again.");
            return;
        }

        alert("Payment Successful. Confirmation Email Sent.");
        document.getElementById('make-payment-popup').classList.add('hidden');

        // Remove from Screen
        const methodId = document.getElementById("appointment-i").value;
        document.getElementById(`payment-${methodId}-container`).remove();
        paymentMethods.splice(methodId, 1);

        if (paymentMethods.length === 0) {
            document.getElementById('no-outstanding').classList.remove('hidden');
        }
    });
});