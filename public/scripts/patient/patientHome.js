document.addEventListener("DOMContentLoaded", async () => {
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
        window.location.href = '../patient/appointmentHistory.html';
    });
    document.getElementById('chatbot').addEventListener('click', () => {
        window.location.href = '../patient/chatbot.html';
    });
    document.getElementById('dwallet').addEventListener('click', () => {
        window.location.href = '../patient/digitalWallet.html';
    });

    // Fetch Patient Information
    const accountId = sessionStorage.getItem('accountId');

    // Retrieve Appointment Detail Information
    const fetchAppointment = await fetch(`/api/appointments/patient/${accountId}`, {
        method: 'GET'
    });

    if (fetchAppointment.status === 401 || fetchAppointment.status === 403) {
        window.location.href = '../login.html';
    }

    const appointmentsJson = await fetchAppointment.json();
    const appointments = appointmentsJson.appointments;

    // Populate Screen with Patient Information
    /// Count and Display Number of Unpaid Payments
    for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].paymentStatus === 'Unpaid') {
            document.getElementById('num-unpaid-num').innerText = parseInt(document.getElementById('num-unpaid-num').innerText) + 1;
        }
    }
    /// Get Future Appointments
    const nowDate = new Date();
    nowDate.setHours(0, 0, 0, 0);
    const futureAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.slotDate);
        return appointmentDate >= nowDate;
    });

    /// Display Future Appointments
    if (futureAppointments.length > 0) {
        document.getElementById('upcoming-appointments-container').classList.remove('hidden'); // Display Container
        document.getElementById('num-upcoming-txt').innerText = futureAppointments.length;

        for (let i = 0; i < futureAppointments.length; i++) {
            document.getElementById("upcoming-appointments").innerHTML += `
                <div class="flex flex-col align-top bg-gray-100 p-5 rounded-xl gap-10" id="appt-${i}">
                    <div class="flex flex-col">
                        <a class="text-2xl"><span class="font-bold">${new Date(futureAppointments[i].slotDate).toISOString().split("T")[0]}</span> | ${futureAppointments[i].slotTime}</a>
                        <a class="text-xl">${futureAppointments[i].reason}</a>
                    </div>

                    <div class="flex space-x-4">
                        <button class="flex-1 py-2 bg-red-300 rounded-lg hover:bg-red-400" id="appt-cancel-${i}">Cancel</button>
                        <button class="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" id="appt-reschedule-${i}">Reschedule</button>
                    </div>
                </div>
            `;
        }

        for (let i = 0; i < futureAppointments.length; i++) {
            const cancelApptId = `appt-cancel-${i}`;
            document.getElementById(cancelApptId).addEventListener('click', async () => {
                const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
                if (!confirmCancel) return;
                else {
                    const fetchCancel = await fetch(`/api/appointments/${futureAppointments[i].id}`, {
                        method: 'DELETE'
                    });
                    if (fetchCancel.status !== 200) {
                        alert("Error Cancelling Appointment. Please try again.");
                        return;
                    }
                    document.getElementById(`appt-${i}`).remove();
                    alert("Appointment Cancelled.");

                    /// Count and Display Number of Appointments
                    document.getElementById('num-upcoming-txt').innerText = futureAppointments.length - 1;
                }
            });

            const rescheduleApptId = `appt-reschedule-${i}`;
            document.getElementById(rescheduleApptId).addEventListener('click', () => {
                window.location.href = '../patient/rescheduleAppointment.html?appointmentId=' + futureAppointments[i].id;
            });
        }
    }
});