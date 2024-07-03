
document.addEventListener('DOMContentLoaded', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    document.getElementById("edit-user-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Collect User Details
        const userValues = {
            name: document.getElementById('name').value,
            creationDate: document.getElementById('creationDate').value,
            knownAllergies: document.getElementById('knownAllergies').value,
            birthdate: document.getElementById('birthdate').value,
            isApproved: document.getElementById('isApproved').value,
        };

        // update patient Account
        const createResponse = await fetch(`/api/staff/patient/${localStorage.getItem('patientId')}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userValues),
        });
        
        if (createResponse.status === 201) {    
            alert("Account Updated Successfully!");
            window.location.reload();;
        } else {
            // Handle errors or unsuccessful account creation
            document.getElementById('error-text').innerText = "Error: Unable to create account. Please try again.";
        }
    });
});