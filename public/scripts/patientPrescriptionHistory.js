document.addEventListener('DOMContentLoaded', async () => {
    // Check if the user has logged in
    const accountId = sessionStorage.getItem('accountId');
    if (!accountId) {
        window.location.href = '../index.html';
        return;
    }

    // Get Data from Appointments Backend
    const fetchPatientResponse = await fetch(`/api/patient/${accountId}`, {
        method: 'GET'
    });
    const patientJson = await fetchPatientResponse.json();
    const patient = patientJson.patient;

    
});