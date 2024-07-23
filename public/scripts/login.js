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
            console.log('Login successful');
            const body = await response.json();
            sessionStorage.setItem('accountId', body.accountId);

            switch (body.role) {
                case 'patient':
                    window.location.href = '/patient/home.html';
                    break;
                case 'doctor':
                    window.location.href = '/doctor/home.html';
                    break;
                case 'admin':
                    window.location.href = '/admin/home.html';
                    break;
                case 'company':
                    window.location.href = '/company/companyHome.html';
                    break;
            }
        } else {
            const error = await response.json();
            if (error) {
                if (error.approvalStatus === "Pending") {
                    document.getElementById('error-text').innerText = "Error: Your account is pending approval by an admin. Check back again.";
                    return;
                }
            }
            document.getElementById('error-text').innerText = error.message;
        }
    });
});