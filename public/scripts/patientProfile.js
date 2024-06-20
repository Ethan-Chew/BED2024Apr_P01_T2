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

    // Fetch Patient Information
    const accountId = sessionStorage.getItem('accountId');
    const getPatientProfile = await fetch(`/patient/${accountId}`);
    const patientJson = await getPatientProfile.json();
    const patient = patientJson.patient;

    // Populate Screen with Patient Info
    document.getElementById('patient-name').innerText = patient.name; 
    document.getElementById('email').value = patient.email;
    document.getElementById('birthday').value = patient.birthdate.split('T')[0];
    document.getElementById('medallergies').value = patient.knownAllergies;

    // Handle Delete Button
    document.getElementById('delete-acc-btn').addEventListener('click', async () => {
        const confirmDelete = confirm("Are you sure you want to delete your account? This process is IRREVERSABLE.");

        if (confirmDelete) {
            const fetchDelete = await fetch(`/patient/${patientId}`, {
                method: 'DELETE'
            });
            if (fetchDelete.status !== 200) {
                alert("Error Deleting Account. Please try again.");
                return;
            }
            alert("Account Deleted Successfully.");
            window.location.href = "/";
        }
    });

    // Handle Verify Password
    document.getElementById('verify-current-pw').addEventListener('click', async () => {
        const inputtedCurrentPw = document.getElementById('current-pw').value;

        const authLogin = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: patient.email,
                password: inputtedCurrentPw
            })
        })
    });
});