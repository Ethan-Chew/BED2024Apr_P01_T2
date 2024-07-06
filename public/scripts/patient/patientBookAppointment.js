document.addEventListener('DOMContentLoaded', async function() {
    // Verify User Logged In
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) window.location.href = "../login.html";
    //. Try to get Patient Profile to verify JWT validity
    const getPatientProfileRequest = await fetch(`/api/patient/${accountId}`);
    if (getPatientProfileRequest.status === 401 || getPatientProfileRequest.status === 403) {
        window.location.href = "../login.html";
    }

    // Listen for onChange of the Appointment Date, then load the available times for the date
    document.getElementById("date").addEventListener("change", async function() {
        console.log("Date Changed");
        // Set the Timeslot Attribute to a Loading Attribute
        const timeslotItem = document.getElementById("timeslot");
        timeslotItem.innerHTML = "<option value='noselect'>Loading...</option>";

        // Get Available Timeslots for the Selected Date
        const date = document.getElementById("date").value;
        const fetchAvailTimeslotsReq = await fetch(`/api/availableSlots/${date}`);
        
        // If the Request is not successful, show an error message
        if (fetchAvailTimeslotsReq.status === 404) {
            // If there are no timeslots, show a message
            timeslotItem.innerHTML = "<option value='noselect'>No Timeslots Available</option>";
            return;
        } else if (fetchAvailTimeslotsReq.status !== 200) {
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
});