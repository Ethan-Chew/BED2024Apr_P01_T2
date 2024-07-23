document.addEventListener('DOMContentLoaded', async () => {

    const response = await fetch(`/api/getAuth/${sessionStorage.getItem('accountId')}`)

    if (response.ok) {
        console.log(response);
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
    
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'flex';
        }
        const overlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
        popup = document.querySelector('.bg-white.w-full.max-w-lg.mx-auto');
    
        overlay.addEventListener('click', function(event) {
            // Check if the click was outside the popup content
            if (!popup.contains(event.target)) {
                // Close the popup by hiding the overlay
                overlay.style.display = 'none';
            }
        });
    }
});