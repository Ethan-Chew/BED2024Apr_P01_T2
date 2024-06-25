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

    // Handle onClick of Main Buttons
    document.getElementById('book-appt').addEventListener('click', () => {
        window.location.href = '../patient/bookAppointment.html';
    });
    document.getElementById('make-payment').addEventListener('click', () => {
        window.location.href = '../patient/makePayment.html';
    });
    document.getElementById('view-history').addEventListener('click', () => {
        window.location.href = '../patient/prescriptionHistory.html';
    });

    // Fetch Patient Information
    const accountId = sessionStorage.getItem('accountId');

    const fetchPatient = await fetch(`/api/patient/${accountId}`, {
        method: 'GET'
    });
    if (fetchPatient.status !== 200) {
        alert("Error Retrieving Patient Information. Please try again.");
        return;
    }

    const patientJson = await fetchPatient.json();
    const patient = patientJson.patient;

    // Populate Screen with Patient Information
    /// Count and Display Number of Unpaid Payments
    for (const appointment of patient.appointments) {
        if (appointment.paymentStatus === 'Unpaid') {
            document.getElementById('num-unpaid-num').innerText = parseInt(document.getElementById('num-unpaid-num').innerText) + 1;
        }
    }
    /// Get Future Appointments
    const nowDate = new Date();
    nowDate.setHours(0, 0, 0, 0);
    const futureAppointments = patient.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.slotDate);
        return appointmentDate >= nowDate;
    });

    /// Display Future Appointments
    if (futureAppointments.length > 0) {
        document.getElementById('upcoming-appointments-container').classList.remove('hidden'); // Display Container
        document.getElementById('num-upcoming-txt').innerText = futureAppointments.length;

        for (const futureAppointment of futureAppointments) {
            document.getElementById("upcoming-appointments").innerHTML += `
                <div class="flex flex-col align-top bg-gray-100 p-5 rounded-xl gap-10" id="appt-${futureAppointment.appointmentId}">
                    <div class="flex flex-col">
                        <a class="text-2xl"><span class="font-bold">${new Date(futureAppointment.slotDate).toISOString().split("T")[0]}</span> | ${futureAppointment.slotTime}</a>
                        <a class="text-xl">${futureAppointment.reason}</a>
                    </div>

                    <div class="flex space-x-4">
                        <button class="flex-1 py-2 bg-red-300 rounded-lg hover:bg-red-400" id="appt-cancel-${futureAppointment.appointmentId}">Cancel</button>
                        <button class="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" id="appt-reschedule-${futureAppointment.appointmentId}">Reschedule</button>
                    </div>
                </div>
            `;
            const cancelApptId = `appt-cancel-${futureAppointment.appointmentId}`;
            document.getElementById(cancelApptId).addEventListener('click', async () => {
                const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
                if (!confirmCancel) return;
                else {
                    const fetchCancel = await fetch(`/api/appointments/${futureAppointment.appointmentId}`, {
                        method: 'DELETE'
                    });
                    if (fetchCancel.status !== 200) {
                        alert("Error Cancelling Appointment. Please try again.");
                        return;
                    }
                    document.getElementById(`appt-${futureAppointment.appointmentId}`).remove();
                    alert("Appointment Cancelled.");
                }
            });

            const rescheduleApptId = `appt-reschedule-${futureAppointment.appointmentId}`;
            document.getElementById(rescheduleApptId).addEventListener('click', () => {
                window.location.href = '../patient/rescheduleAppointment.html?appointmentId=' + futureAppointment.appointmentId;
            });
        }
    }
});