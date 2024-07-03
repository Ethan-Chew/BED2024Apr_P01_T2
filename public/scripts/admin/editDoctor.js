document.addEventListener('DOMContentLoaded', function() {
    async function fetchDoctorData() {
        const urlParams = new URLSearchParams(window.location.search);
        const doctorId = urlParams.get('id');
        const response = await fetch(`/api/doctors/${doctorId}`);
        return await response.json();
    }

    function createDoctorElement(doctor) {
        const doctorDiv = document.createElement('div');
        doctorDiv.className = 'p-6 bg-gray-200 rounded-lg shadow flex justify-between items-center';
        
        // Populate doctor information
        doctorDiv.innerHTML = `
        <form id="edit-doctor-form">
        <div class="flex-1 grid grid-cols-2 gap-x-10 gap-y-2 pr-20 pb-10">
            <div>
                <label class="font-bold" for="name">Doctor Name</label>
                <input id="name" type="text" value="${doctor.name}">
            </div>
            <div>
                <label class="font-bold" for="creationDate">Date of Joining</label>
                <input id="creationDate" type="date" value="${doctor.creationDate}">
            </div>
            <div>
                <label class="font-bold" for="email">Email</label>
                <input id="email" type="email" value="${doctor.email}">
            </div>
            <div>
                <label class="font-bold" for="doctorId">Doctor ID</label>
                <input id="doctorId" type="text" value="${doctor.doctorId}">
            </div>
        </div>
        <div class="flex space-x-2">
            <button class="p-3 bg-white rounded-lg shadow hover:bg-gray-300" type="submit">Submit</button>
        </div>
    </form>
        `;
        
        return doctorDiv;
    }

    async function displayDoctors() {
        const doctor = await fetchDoctorData();
        const container = document.getElementById('editDoctor');
        
        const doctorElement = createDoctorElement(doctor.doctor);
        container.appendChild(doctorElement);
        localStorage.setItem('doctorId', doctor.doctor.doctorId);
    }

    displayDoctors();
});