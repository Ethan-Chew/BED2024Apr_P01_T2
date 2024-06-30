document.addEventListener('DOMContentLoaded', function() {
    async function fetchPatientData() {
        const response = await fetch('/api/patients/unapproved');
        return await response.json();
    }

    function createPatientElement(patient) {
        const patientDiv = document.createElement('div');
        patientDiv.className = 'p-6 bg-gray-200 rounded-lg shadow flex justify-between items-center';
        
        // Populate patient information
        patientDiv.innerHTML = `
            <div class="flex-1 grid grid-cols-2 gap-x-10 gap-y-2 pr-20">
                <div>
                    <div class="font-bold">Patient Name</div>
                    <div>${patient.name}</div>
                </div>
                <div>
                    <div class="font-bold">Date of Creation</div>
                    <div>${patient.creationDate}</div>
                </div>
                <div>
                    <div class="font-bold">Known Allergies</div>
                    <div>${patient.knownAllergies}</div>
                </div>
                <div>
                    <div class="font-bold">Patient Birthdate</div>
                    <div>${patient.birthdate}</div>
                </div>
                <div>
                    <div class="font-bold">Approved Status</div>
                    <div>${patient.isApproved}</div>
                </div>
            </div>
            <div class="flex space-x-2">
                <a class="p-3 bg-white rounded-lg shadow hover:bg-gray-300" href="approveUserQuestionnaire.html?id=${patient.patientId}">View Questionnaire</a>
            </div>
        `;
        
        return patientDiv;
    }

    async function displayPatients(searchTerm = '') {
        const patients = await fetchPatientData();
        const container = document.getElementById('viewPatient');
        container.innerHTML = '';
    
        const filteredPatients = patients.patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        filteredPatients.forEach(patient => {
            const patientElement = createPatientElement(patient);
            container.appendChild(patientElement);
        });
    }

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        displayPatients(searchTerm);
    });

    displayPatients();
});