document.addEventListener("DOMContentLoaded", async () => {
    // Verify User Logged In
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) window.location.href = "../login.html";
    //. Try to get Patient Profile to verify JWT validity
    const getPatientProfileRequest = await fetch(`/api/patient/${accountId}`);
    if (getPatientProfileRequest.status === 401 || getPatientProfileRequest.status === 403) {
        window.location.href = "../login.html";
    }

    // Get Appointment from Appointment Id Query Parameter
    const appointmentId = new URLSearchParams(window.location.search).get('appointmentId');
    if (appointmentId === "" || appointmentId === null) {
        window.location.href = './home.html';
    }

    // Get Appointment Details
    const fetchAppointment = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'GET'
    });
    const fetchAppointmentJson = await fetchAppointment.json();
    const appointment = fetchAppointmentJson.appointment;

    // Set Appointment Details on Screen
    document.getElementById('date').value = appointment.slotDate.split('T')[0];
    document.getElementById('reason').value = appointment.reason;

    // Populate with Slot Date available times
    const timeslotItem = document.getElementById('timeslot');
    const fetchAvailableSlots = await fetch(`/api/availableSlots/${appointment.slotDate}`);

    if (fetchAvailableSlots.status === 404) {
        // If there are no timeslots, show a message
        timeslotItem.innerHTML = "<option value='noselect'>No Timeslots Available</option>";
        return;
    } else if (fetchAvailableSlots.status !== 200) {
        // If the Request is not successful, show an error message
        alert("Error Fetching Available Timeslots. Please try again.");
        return;
    }

    const fetchAvailableSlotsJson = await fetchAvailableSlots.json();
    const availableSlots = fetchAvailableSlotsJson.dateTimeSlots;

    // Populate the Timeslot Dropdown
    timeslotItem.innerHTML = "<option value='noselect'>Select Timeslot</option>";
    availableSlots.push(appointment.slotTime);
    for (let i = 0; i < availableSlots.length; i++) {
        const option = document.createElement("option");
        option.value = availableSlots[i];
        option.text = availableSlots[i];
        timeslotItem.appendChild(option);
    };
    timeslotItem.value = appointment.slotTime;

    // Listen for onChange of the Appointment Date, then load the available times for the date
    document.getElementById("date").addEventListener("change", async function() {
        console.log("Date Changed");
        // Set the Timeslot Attribute to a Loading Attribute
        const timeslotItem = document.getElementById("timeslot");
        timeslotItem.innerHTML = "<option value='noselect'>Loading...</option>";

        // Get Available Timeslots for the Selected Date
        const date = document.getElementById("date").value;
        const fetchAvailTimeslotsReq = await fetch(`/api/availableSlots/${date}`);
        
        if (fetchAvailTimeslotsReq.status === 404) {
            // If there are no timeslots, show a message
            timeslotItem.innerHTML = "<option value='noselect'>No Timeslots Available</option>";
            return;
        } else if (fetchAvailTimeslotsReq.status !== 200) {
            // If the Request is not successful, show an error message
            alert("Error Fetching Available Timeslots. Please try again.");
            return;
        }

        // Parse the Response
        const availTimeslots = await fetchAvailTimeslotsReq.json();
        const timeslots = availTimeslots.dateTimeSlots;
        
        // Populate the Timeslot Dropdown
        timeslotItem.innerHTML = "<option value='noselect'>Select Timeslot</option>";
        for (let i = 0; i < timeslots.length; i++) {
            const option = document.createElement("option");
            option.value = timeslots[i];
            option.text = timeslots[i];
            timeslotItem.appendChild(option);
        }
    });

    // Listen for onClick Update Appointment
    document.getElementById('update-booking-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get Form Data
        const reason = document.getElementById('reason').value;
        const date = document.getElementById('date').value;
        const timeslot = document.getElementById('timeslot').value;

        if (timeslot === "noselect") {
            alert("Please select a timeslot.");
            return;
        }

        // Get Timeslot Detail
        const timeslotDetail = await fetch(`/api/availableSlot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ date: date, time: timeslot })
        });
        const timeslotDetailJson = await timeslotDetail.json();
        const availSlot = timeslotDetailJson.availableSlot[0].SlotId;
        // Update the Appointment
        const appointmentBody = {
            patientId: accountId,
            slotId: availSlot,
            reason: reason
        };
        const updateAppointment = await fetch(`/api/appointments/${appointmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentBody)
        });

        if (updateAppointment.status === 200) {
            alert("Appointment Updated Successfully");
            window.location.href = './home.html';
        }
    });
});