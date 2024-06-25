document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("edit-user-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Collect Company Details
        const companyDetails = {
            name: document.getElementById('companyName').value,
            email: document.getElementById('email').value,
            password: password,
            companyAddress: document.getElementById('address').value,
            createdBy: createdBy
        };

        // Create Company Account
        const createResponse = await fetch('/api/patient/:patientId', {
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