document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("login-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const response = await fetch('/api/auth/login', {
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
                const fetchPatient = await fetch(`/api/patient/${account.PatientId}`, {
                    method: 'GET'
                });
                const patientJson = await fetchPatient.json();
                const patient = patientJson.patient;

                // Show Results based on Approval Status
                switch (patient.isApproved) {
                    case "Approved":
                        sessionStorage.setItem('accountType', 'patient');
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
                sessionStorage.setItem('accountType', 'company');
                window.location.href = './company/companyHome.html';
                localStorage.setItem('currentUser', account.CompanyId);
            } else if (account.DoctorId) {
                sessionStorage.setItem('accountType', 'doctor');
                window.location.href = './doctor/home.html';
                localStorage.setItem('currentUser', account.DoctorId);
            } else if (account.StaffId) {
                sessionStorage.setItem('accountType', 'staff');
                window.location.href = './staff/home.html';
                localStorage.setItem('currentUser', account.StaffId);
            }
        } else {
            const error = await response.json();
            document.getElementById('error-text').innerText = error.message;
        }
    });
});