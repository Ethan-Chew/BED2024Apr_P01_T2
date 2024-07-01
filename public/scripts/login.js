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
                    window.location.href = '/company/home.html';
                    break;
            }
        } else {
            const error = await response.json();
            document.getElementById('error-text').innerText = error.message;
        }
    });
});