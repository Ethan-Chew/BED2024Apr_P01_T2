document.addEventListener('DOMContentLoaded', async () => {
    let patientDetails = {};

    document.getElementById("create-acc-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Check Passwords Match
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
    
        if (password !== confirmPassword) {
            document.getElementById('error-text').innerText = "Error: Passwords do not match!";
            return;
        }

        // Save Patient Details
        patientDetails = {
            name: document.getElementById('fullname').value,
            username: document.getElementById('username').value,
            password: password,
            knownAllergies: document.getElementById('knownallergies').value,
            birthdate: document.getElementById('dob').value,
        };


        // Hide Create Account Container, show Questionnaire Container
        document.getElementById("create-account-container").classList.add("hidden");
        document.getElementById("questionnaire-container").classList.remove("hidden");
    });
    
    document.getElementById("questionnaire-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Get Questionnaire Answers
        const qns = {
            qOne: document.getElementById('qn1').value,
            qTwo: document.getElementById('qn2').value,
            qThree: document.getElementById('qn3').value,
            qFour: document.getElementById('qn4').value,
            qFive: document.getElementById('qn5').value,
            qSix: document.getElementById('qn6').value,
        };

        patientDetails.qns = qns;
        
        // Create Account
        const createResponse = await fetch('/auth/create/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientDetails),
        })
        
        if (createResponse.status === 201) {
            
        }
    });
});