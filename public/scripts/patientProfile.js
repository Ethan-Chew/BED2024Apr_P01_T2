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
    if (accountId === undefined) console.error("Account ID not found in Session Storage."); 
    const getPatientProfile = await fetch(`/api/patient/${accountId}`, {
        method: 'GET'
    });
    const patientJson = await getPatientProfile.json();
    const patient = patientJson.patient;

    // Populate Screen with Patient Info
    document.getElementById('patient-name').innerText = patient.name; 
    document.getElementById('name').value = patient.name;
    document.getElementById('email').value = patient.email;
    document.getElementById('birthday').value = patient.birthdate.split('T')[0];
    document.getElementById('medallergies').value = patient.knownAllergies;

    // Handle Delete Button
    document.getElementById('delete-acc-btn').addEventListener('click', async () => {
        const confirmDelete = confirm("Are you sure you want to delete your account? This process is IRREVERSABLE.");

        if (confirmDelete) {
            const fetchDelete = await fetch(`/api/patient/${accountId}`, {
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

    // Handle Update Button
    document.getElementById('update-acc-btn').addEventListener('click', async () => {
        // Verify Password Change Match
        const newPassword = document.getElementById('new-pw').value;
        const verifyPassword = document.getElementById('new-pw-verify').value;

        if (newPassword !== "" && newPassword !== verifyPassword) {
            alert("New Passwords do not match. Please try again.");
            return;
        }

        // Verify Fields have been updated
        let updatedUser = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            birthdate: document.getElementById('birthday').value,
            knownAllergies: document.getElementById('medallergies').value,
        }

        let isUpdated = false;

        for (const key in updatedUser) {
            if (updatedUser[key] !== patient[key] && updatedUser[key] !== '') {
                isUpdated = true;
                break;
            }
        }
        
        updatedUser.password = newPassword === "" || newPassword === null ? null : newPassword;
        if (!isUpdated) {
            if (updatedUser.password === null) {
                alert("Your Profile has not been updated!");
                return;
            }
        }

        // Send Update Request
        const updateUserRequest = await fetch(`/api/patient/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });

        if (updateUserRequest.status !== 200) {
            alert("Error Updating Account. Please try again.");
            return;
        } else {
            alert("Account Updated Successfully.");

            // Update Screen Info
            document.getElementById('patient-name').innerText = updatedUser.name; 
            document.getElementById('name').value = updatedUser.name;
            document.getElementById('email').value = updatedUser.email;
            document.getElementById('birthday').value = updatedUser.birthdate.split('T')[0];
            document.getElementById('medallergies').value = updatedUser.knownAllergies;
        }
    });

    // Handle Verify Password
    document.getElementById('verify-current-pw').addEventListener('click', async () => {
        const inputtedCurrentPw = document.getElementById('current-pw').value;

        const authLogin = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: patient.email,
                password: inputtedCurrentPw
            })
        });

        if (authLogin.status !== 200) {
            document.getElementById('password-verify-txt').innerText = "Error: Password does not match."
            document.getElementById('new-pw').disabled = true;
            document.getElementById('new-pw-verify').disabled = true;
            return;
        }

        document.getElementById('password-verify-txt').innerText = "Password Verified";
        document.getElementById('new-pw').disabled = false;
        document.getElementById('new-pw-verify').disabled = false;
    });
});