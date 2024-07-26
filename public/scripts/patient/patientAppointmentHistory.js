document.addEventListener('DOMContentLoaded', async () => {
    // Verify User Logged In
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) window.location.href = "./login.html";
    
    // Get all Appointments with the Patient's Account Id
    const fetchAppointmentsResponse = await fetch(`/api/appointments/patient/${accountId}`, {
        method: 'GET'
    });
    if (fetchAppointmentsResponse.status === 401 || fetchAppointmentsResponse.status === 403) window.location.href = '../login.html';
    const appointmentsJson = await fetchAppointmentsResponse.json();
    const appointments = appointmentsJson.appointments;

    // Get all Appointment Detail
    let appointmentDetails = [];
    for (let i = 0; i < appointments.length; i++) {
        const fetchAppointmentDetailResponse = await fetch(`/api/appointments/${appointments[i].id}`, {
            method: 'GET'
        });
        const appointmentDetailJson = await fetchAppointmentDetailResponse.json();
        const appointmentDetail = appointmentDetailJson.appointment;
        appointmentDetails.push(appointmentDetail);
    }

    // Display Appointment Details on the Screen
    const unpaidAppointments = appointmentDetails.filter((appointment) => appointment.paymentStatus !== null);
    unpaidAppointments.forEach((appointment) => {
        document.getElementById('history-container').innerHTML += `
            <div class="bg-gray-200 p-6 mb-3 rounded-lg">
                <h3 class="text-2xl font-bold">${appointment.reason}</h3>
                <p class="text-gray-700 mb-5">Date: ${appointment.slotDate.split("T")[0]}</p>
                <div class="flex flex-row gap-5">
                    <!-- Prescription Details -->
                    <div class="flex flex-auto flex-col gap-3">
                        ${appointment.medication.map((drug) => `
                            <div class="bg-white p-4 rounded-lg shadow">
                                <h4 class="text-xl font-bold">${drug.drugName}</h4>
                                <p>${drug.drugReason}</p>
                                <p class="font-semibold mt-2">Quantity: ${drug.quantity} tablets</p>
                            </div>
                        `).join('')}
                    </div>
                    <!-- Invoice Details -->
                    <div class="bg-white p-4 rounded-lg shadow flex-grow">
                        <h4 class="text-xl font-bold mb-4">Invoice Details</h4>
                        <ul>
                            <li class="flex justify-between mb-2">
                                <span>Consultation Fee</span>
                                <span>$${appointment.consultationCost}</span>
                            </li>
                            <div id="appointment-${appointment.appointmentId}-drugs"></div>
                        </ul>
                        <div class="flex justify-between font-bold mb-2">
                            <span>Total Amount:</span>
                            <span id="appointment-${appointment.appointmentId}-final"></span>
                        </div>
                        <p class="text-gray-400 italic">${appointment.paymentStatus === "Unpaid" ? "Pending Payment" : "Fully Paid"}</p>
                    </div>
                </div>
            </div>
        `;

        const totalAmount = appointment.medication.reduce((sum, item) => sum + item.drugPrice, 0) + appointment.consultationCost;
        appointment.medication.forEach((drug) => {
            document.getElementById(`appointment-${appointment.appointmentId}-drugs`).innerHTML += `
                <li class="flex justify-between mb-2">
                    <span>${drug.drugName} (${drug.quantity} Tablets)</span>
                    ${drug.drugRequest === "Completed" ? "<span>$0 <i>Company Fufilled</i></span>" : `<span>$${drug.drugPrice}</span>`}
                </li>
            `;
    
            if (drug.drugRequest === "Completed") {
                totalAmount -= drug.drugPrice;
            }
        });
        document.getElementById(`appointment-${appointment.appointmentId}-final`).innerText = `$${totalAmount}`;
    });
});