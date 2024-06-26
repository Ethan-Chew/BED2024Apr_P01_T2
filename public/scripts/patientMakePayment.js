document.addEventListener("DOMContentLoaded", async () => {
    // Check that the User is a Patient
    if (sessionStorage.getItem('accountType') !== 'patient') {
        window.location.href = '../login.html';
        return;
    }

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
                    <button class="px-6 py-2 self-start rounded-xl bg-gray-400 text-white hover:bg-gray-500" id="help-btn-${i}">
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

    }
    console.log(unpaidAppointments);
});