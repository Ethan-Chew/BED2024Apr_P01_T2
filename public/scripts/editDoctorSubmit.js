document.addEventListener('DOMContentLoaded', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    document.getElementById("edit-doctor-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Collect Doctor Details
        const doctorValues = {
            name: document.getElementById('name').value,
            creationDate: document.getElementById('creationDate').value,
            email: document.getElementById('email').value,
            doctorId: document.getElementById('doctorId').value,
        };

        console.log(JSON.stringify(doctorValues));

        // Update Doctor Account
        const updateResponse = await fetch(`/api/doctors/${localStorage.getItem('doctorId')}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(doctorValues),
        });

        console.log(updateResponse.json());
        
        if (updateResponse.status === 200) {    
            alert("Doctor Account Updated Successfully!");
            window.location.reload();
        } else {
            // Handle errors or unsuccessful account edit
            document.getElementById('error-text').innerText = "Error: Unable to edit doctor account. Please try again.";
        }
    });
});