document.addEventListener("DOMContentLoaded", async () => {
    // Check that the User is a Doctor
    // Turn off for now
    /*
    if (sessionStorage.getItem('accountType') !== 'doctor') {
        window.location.href = '../login.html';
        return;
    }
    */

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

    // Fetch Doctor Information
    const accountId = sessionStorage.getItem('accountId');

    const fetchDoctor = await fetch(`/api/doctor/${accountId}`, {
        method: 'GET'
    });
    if (fetchDoctor.status !== 200) {
        alert("Error Retrieving Doctor Information. Please try again.");
        return;
    }   

    const doctorJson = await fetchDoctor.json();
    const doctor = doctorJson.patient;

    // Display Doctor information
    // Display upcoming appts for doctor
    
});