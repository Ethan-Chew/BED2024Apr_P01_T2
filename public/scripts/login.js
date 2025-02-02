document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("login-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        var response = await fetch('/api/auth/login', {
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
            sessionStorage.setItem('email', email);

            switch (body.role) {
                case 'patient':
                    window.location.href = '/patient/home.html';
                    break;
                case 'doctor':
                    window.location.href = '/doctor/home.html';
                    break;
                case 'admin':
                    var popup = document.getElementById('popup');

                    document.getElementById("popup").addEventListener("submit", async function (e) {
                        e.preventDefault();

                        document.getElementById('error').style.display = 'none';
                        document.getElementById('success').style.display = 'none';
                        document.getElementById('errorVerify').style.display = 'none';
                        document.getElementById('successVerify').style.display = 'none';

                        response = await fetch(`/api/verify2FA/${sessionStorage.getItem('accountId')}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Token': document.getElementById('token').value,
                            },
                        });
                        if (response.status === 200) {
                            document.getElementById('success').style.display = 'flex';
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            popup.style.display = 'none';
                            window.location.href = '/admin/home.html';
                        } else {
                            document.getElementById('error').style.display = 'flex';
                        }
                    });

                    document.getElementById("popupVerify").addEventListener("submit", async function (e) {
                        e.preventDefault();

                        response = await fetch(`/api/verify2FA/${sessionStorage.getItem('accountId')}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Token': document.getElementById('tokenVerify').value,
                            },
                        });
                        if (response.status === 200) {
                            document.getElementById('successVerify').style.display = 'flex';
                            window.location.href = '/admin/home.html';
                        } else {
                            document.getElementById('errorVerify').style.display = 'flex';
                        }
                    });

                    response = await fetch(`/api/getAuth/${sessionStorage.getItem('accountId')}`)
                    console.log(response.status);

                    if (response.status === 200) {
                        document.getElementById('popupVerify').style.display = 'flex';
                    }
                    else {
                        response = await fetch('/api/generateQRCode', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Email': sessionStorage.getItem('email'),
                                'AccountId': sessionStorage.getItem('accountId'),
                            },
                        });
                    
                        if (response.ok) {
                            const imageUrl = await response.text();
                            document.getElementById('qrcode').src = imageUrl;
                        } else {
                            console.error('Failed to load QR code', await response.text());
                        }
                    
                        if (popup) {
                            popup.style.display = 'flex';
                        }
                    }
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