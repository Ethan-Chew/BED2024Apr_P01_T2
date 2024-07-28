
document.addEventListener('DOMContentLoaded', async () => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    document.getElementById("edit-user-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);

        // Collect User Details
        const userValues = {
            name: document.getElementById('name').value,
            creationDate: document.getElementById('creationDate').value,
            knownAllergies: document.getElementById('knownAllergies').value,
            birthdate: document.getElementById('birthdate').value,
            isApproved: document.getElementById('isApproved').value,
        };

        // update patient Account
        const createResponse = await fetch(`/api/staff/patient/${urlParams.get('id')}`, {
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