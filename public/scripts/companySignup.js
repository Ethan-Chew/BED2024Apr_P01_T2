document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("create-company-acc-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Check Passwords Match
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const createdBy = localStorage.getItem('currentUser');
    
        if (password !== confirmPassword) {
            document.getElementById('error-text').innerText = "Error: Passwords do not match!";
            return;
        }

        // Collect Company Details
        const companyDetails = {
            name: document.getElementById('companyName').value,
            email: document.getElementById('email').value,
            password: password,
            companyAddress: document.getElementById('address').value,
            createdBy: createdBy
        };

        // Create Company Account
        const createResponse = await fetch('/api/auth/create/company', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyDetails),
        });
        
        if (createResponse.status === 201) {
            alert("Company Account Created Successfully!");
            window.location.href = "home.html";
        } else {
            // Handle errors or unsuccessful account creation
            document.getElementById('error-text').innerText = "Error: Unable to create account. Please try again.";
        }
    });
});