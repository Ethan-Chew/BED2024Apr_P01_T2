document.addEventListener("DOMContentLoaded", async () => {
    // Check that the User is a Doctor
    if (sessionStorage.getItem('accountType') !== 'doctor') {
        window.location.href = '../login.html';
        return;
    }

    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Handle onClick of Main Buttons
    document.getElementById('view-appt').addEventListener('click', () => {
        window.location.href = '../doctor/viewAppointments.html';
    });
    document.getElementById('view-medrec').addEventListener('click', () => {
        window.location.href = '../doctor/viewMedicalRecords.html';
    });
    document.getElementById('view-medlist').addEventListener('click', () => {
        window.location.href = '../doctor/viewMedicationList.html';
    });
    document.getElementById('view-schedule').addEventListener('click', () => {
        window.location.href = '../doctor/consultationSchedule.html';
    });

    // Fetch Doctor id from session
    const accountId = sessionStorage.getItem('accountId');

    // Display information for doctor
    // Retrieve Appointment Detail Information
    const fetchAppointment = await fetch(`/api/appointments/doctor/${accountId}`, {
        method: 'GET'
    });
    const appointmentsJson = await fetchAppointment.json();
    let appointments = appointmentsJson.appointments;
    console.log(appointments)
    console.log(appointments[0].SlotDate)

    /// Get Future Appointments+
    // Filter upcoming appts for doctor
    if (appointments.length > 0) {
        document.getElementById('upcoming-appointments-container').classList.remove('hidden'); // Display Container
        document.getElementById('num-upcoming-txt').innerText = appointments.length;
        var selectedAppointmentId = "";
        var selectedSlotId = "";
        for (const appointment of appointments) {
            console.log(appointment)
            document.getElementById("upcoming-appointments").innerHTML += `
                <div class="flex flex-col align-top bg-gray-100 p-5 rounded-xl gap-10" id="appt-${appointment.AppointmentId}">
                    <div class="flex flex-col">
                        <a class="text-2xl"><span class="font-bold">${new Date(appointment.SlotDate).toISOString().split("T")[0]}</span> | ${appointment.SlotTime}</a>
                        <a class="text-2xl"><span class="font-bold">
                        <a class="text-xl">${appointment.Reason}</a>
                    </div>

                    <div class="flex space-x-4">
                        <button class="flex-1 py-2 bg-red-300 rounded-lg hover:bg-red-400" id="appt-cancel-${appointment.AppointmentId}">Cancel</button>
                        <button class="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" id="appt-reschedule-${appointment.AppointmentId}">Reschedule</button>
                        <button class="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" id="appt-view-${appointment.AppointmentId}">View</button>
                    </div>
                </div>
            `;
            /*
            const cancelApptId = `appt-cancel-${futureAppointment.appointmentId}`;
            document.getElementById(cancelApptId).addEventListener('click', async () => {
                const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
                if (!confirmCancel) return;
                else {
                    const fetchCancel = await fetch(`/api/appointments/${futureAppointment.appointmentId}`, {
                        method: 'PUT'
                    });
                    if (fetchCancel.status !== 200) {
                        alert("Error Cancelling Appointment. Please try again.");
                        return;
                    }
                    document.getElementById(`appt-${futureAppointment.appointmentId}`).remove();
                    alert("Appointment Cancelled.");

                    /// Count and Display Number of Appointments
                    document.getElementById('num-upcoming-txt').innerText = futureAppointments.length - 1;
                }
            });
            */

            let rescheduleApptId = `appt-reschedule-${appointment.AppointmentId}`;
            console.log(rescheduleApptId)
            document.getElementById(rescheduleApptId).addEventListener('click', () => {
                document.getElementById("reschedule-form").classList.remove('hidden');
                document.getElementById("reschedule-formed").classList.remove('hidden');
                selectedAppointmentId = appointment.AppointmentId;
                selectedSlotId = appointment.SlotId;
                console.log(selectedAppointmentId);
                //window pop up
            });

            let viewApptId = `appt-view-${appointment.AppointmentId}`;
            document.getElementById(viewApptId).addEventListener('click', () => {
                window.location.href = './viewAppointments.html?appointmentId=' + appointment.AppointmentId;
            });
        }
    }

    const startTime = document.getElementById('newTimeStart');
    const endTime = document.getElementById('newTimeEnd');
    startTime.addEventListener('change', function () {
        // get hours and minutes as integer values
        let hours = parseInt(startTime.value.split(':')[0]);
        let minutes = parseInt(startTime.value.split(':')[1]);
        // add 30 minutes
        minutes += 30;
        // if an hour is exceeded, add it to hours instead
        // and account for a day passing by
        if (minutes >= 60) {
            hours = (hours + 1) % 24;
            minutes -= 60;
        }
        // reformat values as strings with a fix length of 2
        hours = (hours < 10 ? `0${hours}` : `${hours}`);
        minutes = (minutes < 10 ? `0${minutes}` : `${minutes}`);
        // assign new value to the end input
        endTime.value = `${hours}:${minutes}`;
    });

    document.getElementById("reschedule-form-close").addEventListener('click', () => {
        document.getElementById("reschedule-form").classList.add('hidden');
        document.getElementById("reschedule-formed").classList.add('hidden');
    });

    6

    // liberated code
    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
    }

    async function updateAppointmentDateTime(slotId, doctorId, date, time) {
        const fields = {
            doctor: doctorId,
            date: date,
            time: time
        }
        console.log(fields);

        updateResponse = await fetch(`/api/availableSlot/doctor/${slotId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields),
        });

        if (updateResponse.status === 200) {
            alert("Appointment successfully rescheduled.");
        } else {
            alert("Error: Unable to reschedule appointment.");
        }
    }


    document.getElementById("reschedule-form-submit").addEventListener('click', () => {
        var sendDate = document.getElementById('newDate').value;
        var TimeStart = convertTime12to24(startTime.value);
        var TimeEnd = convertTime12to24(endTime.value);
        var timeSlotValue = TimeStart + "-" + TimeEnd;
        console.log(timeSlotValue);
        console.log(sendDate);
        console.log(accountId);

        updateAppointmentDateTime(selectedSlotId, accountId, sendDate, timeSlotValue)


    });


});