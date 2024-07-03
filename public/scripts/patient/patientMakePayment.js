document.addEventListener("DOMContentLoaded", async () => {

    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Fetch Patient's AccountId
    const accountId = sessionStorage.getItem('accountId');
    
    // Fetch Data from Backend
    const fetchPatientResponse = await fetch(`/api/patient/${accountId}`, {
        method: 'GET'
    });
    if (fetchPatientResponse.status !== 200) {
        alert("Error Retrieving Patient Information. Please try again.");
        return;
    }
    const patientJson = await fetchPatientResponse.json();
    const patient = patientJson.patient;

    // Retrive Appointments from Database and Filter Unpaid Appointments
    const appointmentIds = patient.appointmentIds;
    let unpaidAppointments = [];
    for (let i = 0; i < appointmentIds.length; i++) {
        const fetchAppointmentResponse = await fetch(`/api/appointments/${appointmentIds[i]}`, {
            method: 'GET'
        });
        if (fetchAppointmentResponse.status !== 200) {
            alert("Error Retrieving Appointment Information. Please try again.");
            return;
        }
        const appointmentJson = await fetchAppointmentResponse.json();
        if (appointmentJson.appointment.paymentStatus === 'Unpaid') {
            unpaidAppointments.push(appointmentJson.appointment);
        }
    }

    // Get Patient's Payment Methods
    const fetchPaymentMethodsResponse = await fetch(`/api/patient/${accountId}/paymentMethods`, {
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

    // Display Unpaid Appointments on the Screen
    const paymentListContainer = document.getElementById('paymentlist-container');
    for (let i = 0; i < unpaidAppointments.length; i++) {
        const appointment = unpaidAppointments[i];
        let totalAmount = appointment.consultationCost;

        paymentListContainer.innerHTML += `
            <div class="bg-gray-100 shadow-lg p-3 rounded-2xl text-lg" id="payment-${i}">
                <h3 class="text-3xl font-bold mb-2">Invoice Details</h3>
                <div class="w-1/2 flex flex-row">
                    <div id="payment-med-${i}" class="flex flex-col gap-2">
                        
                    </div>

                    <div class="ml-auto flex flex-col gap-2" id="payment-med-cost-${i}">
                        
                    </div>
                </div>
                <div class="flex flex-row gap-10 items-center mt-3">
                    <div>
                        <p><span class="font-bold">Total Amount: </span>$<span id="payment-${i}-totalcost"></span></p>
                        <p class="text-gray-500" id="help-text-${i}">Can't afford it now? Ask for help from a member of the public.</p>
                    </div>
                    <button class="ml-auto px-6 py-2 self-start rounded-xl bg-primary text-white hover:bg-btnprimary">
                        Pay
                    </button>
                    <button class="px-6 py-2 self-start rounded-xl bg-gray-400 text-white hover:bg-gray-500" id="help-${i}">
                        Request Help
                    </button>
                </div>
            </div>
        `;

        // Set the Text for ask help
        if (appointment.paymentRequest) {
            document.getElementById(`help-text-${i}`).innerText = `Help requested on ${appointment.paymentRequest.createdDate.split("T")[0]}. Status: ${appointment.paymentRequest.status}`;
            document.getElementById(`help-btn-${i}`).disabled = true;
            document.getElementById(`help-btn-${i}`).classList.add('cursor-not-allowed');
        }
        
        // Add Medication and Cost to Screen
        for (let j = 0; j < appointment.medication.length; j++) {
            document.getElementById(`payment-med-${i}`).innerHTML += `<a>${appointment.medication[j].drugName}</a>`;
            document.getElementById(`payment-med-cost-${i}`).innerHTML += `<a>$${appointment.medication[j].drugPrice}</a>`;
            totalAmount += appointment.medication[j].drugPrice;
        }
        document.getElementById(`payment-${i}-totalcost`).innerText = totalAmount; // Set total cost amount

        // Set Event Listeners for Payment and Help Buttons
        document.getElementById(`payment-${i}`).addEventListener('click', async () => {
            // Send Text to Payment Confirmation Popup
            document.getElementById('payment-amount').innerText = totalAmount;
            document.getElementById('appointment-date').value = appointment.slotDate;
            document.getElementById('appointment-time').value = appointment.slotTime;
            document.getElementById('appointment-id').value = appointment.appointmentId;

            // Display Payment Confirmation Popup
            document.getElementById('make-payment-popup').classList.remove('hidden');
        });
        document.getElementById(`help-${i}`).addEventListener('click', async () => {
            // Confirm Help Request
            const confirmHelpRequest = confirm("Are you sure you want to request help for this payment?");

            if (confirmHelpRequest) {
                const requestHelpResponse = await fetch(`/api/patient/${accountId}/requestHelp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appointmentId: appointment.appointmentId,
                    })
                });

                if (requestHelpResponse.status !== 200) {
                    alert("Error Requesting Help. Please try again.");
                    return;
                }

                alert("Help Request Sent. Please wait for approval.");
                document.getElementById(`help-text-${i}`).innerText = `Help requested on ${new Date().toISOString().split("T")[0]}. Status: Pending`;
                document.getElementById(`help-${i}`).disabled = true;
                document.getElementById(`help-${i}`).classList.add('cursor-not-allowed');
            }
        });
    }

    // Handle Payment Confirmation Submission
    document.getElementById('paymentForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get Selected Payment Method
        const last4DigitCard = document.querySelector('input[name="paymentMethod"]:checked').value;
        const cardMerchant = paymentMethods.find(method => String(method.cardNumber).slice(-4) === last4DigitCard).merchant;

        if (!last4DigitCard) {
            console.log(document.querySelector('input[name="paymentMethod"]:checked'))
            alert("Please select a payment method.");
            return;
        }

        // Send Payment Paid Request
        const makePaymentRequest = await fetch('/api/patient/makePayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentId: document.getElementById('appointment-id').value,
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
                paymentAmount: Number(document.getElementById("payment-amount").innerText),
                appointmentDate: new Date(unpaidAppointments[0].consultationCost).toISOString().split("T")[0],
                appointmentTime: unpaidAppointments[0].slotDate,
            })
        });

        if (sendConfirmationEmail.status !== 201) {
            alert("Error Sending Confirmation Email. Please try again.");
            return;
        }

        alert("Payment Successful. Confirmation Email Sent.");
        document.getElementById('make-payment-popup').classList.add('hidden');

        // Remove from Screen
        document.getElementById("method-" + i).remove();
        paymentMethods.splice(i, 1);
    });
});