document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/generateQRCode', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Email': localStorage.getItem('email'),
        },
    });

    if (response.ok) {
        const imageUrl = await response.text();
        document.getElementById('qrcode').src = imageUrl;
    } else {
        console.error('Failed to load QR code', await response.text());
    }
});