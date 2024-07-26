document.addEventListener('DOMContentLoaded', function() {
    async function fetchDoctorData() {
        const response = await fetch('/api/doctors/');
        return await response.json();
    }

    function createDoctorElement(doctor) {
        const doctorDiv = document.createElement('div');
        doctorDiv.className = 'p-6 bg-gray-200 rounded-lg shadow flex justify-between items-center';
        
        // Populate doctor information
        doctorDiv.innerHTML = `
            <div class="flex-1 grid grid-cols-2 gap-x-10 gap-y-2 pr-20">
                <div>
                    <div class="font-bold">Doctor Name</div>
                    <div>${doctor.name}</div>
                </div>
                <div>
                    <div class="font-bold">Date of Joining</div>
                    <div>${doctor.creationDate}</div>
                </div>
                <div>
                    <div class="font-bold">Email</div>
                    <div>${doctor.email}</div>
                </div>
                <div>
                    <div class="font-bold">Doctor ID</div>
                    <div>${doctor.doctorId}</div>
                </div>
            </div>
            <div class="flex space-x-2">
                <a class="p-3 bg-white rounded-lg shadow hover:bg-gray-300" href="editDoctor.html?id=${doctor.doctorId}">Edit Details</a>
            </div>
        `;
        
        return doctorDiv;
    }

    async function displayDoctors(searchTerm = '') {
        const doctors = await fetchDoctorData();
        const container = document.getElementById('viewDoctor');
        container.innerHTML = ''; // Clear existing doctors
    
        const filteredDoctors = doctors.doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        filteredDoctors.forEach(doctor => {
            const doctorElement = createDoctorElement(doctor);
            container.appendChild(doctorElement);
        });
    }

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        displayDoctors(searchTerm);
    });

    displayDoctors();
});