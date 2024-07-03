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

    // will prob remove this see how
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

    // Get appointments 

    let name = []

    // view patient's medical records

    // reschedule appointment

    // cancel appointment
});