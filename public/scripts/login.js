document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("login-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.status === 200) {
            const body = await response.json();
            const account = body.account;
            
            // Check for User's Role
            sessionStorage.setItem('accountId', account.AccountId);
            if (account.PatientId) {
                // Check if the User Account has been Approved
                const fetchPatient = await fetch(`/patient/${account.PatientId}`, {
                    method: 'GET'
                });
                const patientJson = await fetchPatient.json();
                const patient = patientJson.patient;

                // Show Results based on Approval Status
                switch (patient.PatientIsApproved) {
                    case "Approved":
                        window.location.href = './patient/home.html';
                        return;
                    case "Pending":
                        document.getElementById('error-text').innerText = "Your Account is Pending Approval by an Admin. You will be able to login once approved.";
                        break;
                    case "Declined":
                        document.getElementById('error-text').innerText = "Your Account has been Rejected by an Admin.";
                        break;
                }
            } else if (account.CompanyId) {
                window.location.href = './company/home';
            } else if (account.DoctorId) {
                window.location.href = './doctor/home';
            } else if (account.StaffId) {
                window.location.href = './staff/home';
            }
        } else {
            const error = await response.json();
            document.getElementById('error-text').innerText = error.message;
        }
    });
});