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
            
            // Check for User's Role
            sessionStorage.setItem('patientId', body.PatientId);
            if (body.PatientId) {
                window.location.href = '/patient/home';
            } else if (body.CompanyId) {
                window.location.href = '/company/home';
            } else if (body.DoctorId) {
                window.location.href = '/doctor/home';
            } else if (body.AdminId) {
                window.location.href = '/admin/home';
            }
        } else {
            const error = await response.json();
            document.getElementById('error-text').innerText = error.message;
        }
    });
});