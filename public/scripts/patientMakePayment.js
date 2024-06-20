document.addEventListener("DOMContentLoaded", async () => {
    // Check that the User is a Patient
    if (sessionStorage.getItem('accountType') !== 'patient') {
        window.location.href = '../login.html';
        return;
    }

    // Fetch Patient's AccountId
    const accountId = sessionStorage.getItem('accountId');
    
    // Fetch Data from Backend
    const fetchPatientResponse = await fetch(`/patient/${accountId}`, {
        method: 'GET'
    });
    if (fetchPatientResponse.status !== 200) {
        alert("Error Retrieving Patient Information. Please try again.");
        return;
    }
    const patientJson = await fetchPatient.json();
    const patient = patientJson.patient;

    // Populate Screen with Patient Information
    let unpaidAppointments = []
    for (const appointment in patient.appointments) {
        if (appointment.paymentStatus !== 'Paid') {
            unpaidAppointments.push(appointment);
        }
    }
});