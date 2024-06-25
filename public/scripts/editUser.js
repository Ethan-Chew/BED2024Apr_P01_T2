document.addEventListener('DOMContentLoaded', function() {
    async function fetchAccountData() {
        const urlParams = new URLSearchParams(window.location.search);
        const accountId = urlParams.get('id');
        const response = await fetch(`/api/patient/${accountId}`);
        return await response.json();
    }

    function createAccountElement(patient) {
        const accountDiv = document.createElement('div');
        accountDiv.className = 'p-6 bg-gray-200 rounded-lg shadow flex justify-between items-center';
        
        // Populate account information
        accountDiv.innerHTML = `
        <form id="edit-user-form">
        <div class="flex-1 grid grid-cols-2 gap-x-10 gap-y-2 pr-20 pb-10">
            <div>
                <label class="font-bold" for="name">Patient Name</label>
                <input id="name" type="text" value="${patient.name}">
            </div>
            <div>
                <label class="font-bold" for="creationDate">Date of Creation</label>
                <input id="creationDate" type="date" value="${patient.creationDate}">
            </div>
            <div>
                <label class="font-bold" for="knownAllergies">Known Allergies</label>
                <input id="knownAllergies" type="text" value="${patient.knownAllergies}">
            </div>
            <div>
                <label class="font-bold" for="birthdate">Patient Birthdate</label>
                <input id="birthdate" type="date" value="${patient.birthdate}">
            </div>
            <div>
                <label class="font-bold" for="isApproved">Approved Status</label>
                <select id="isApproved">
                    <option value="true" ${patient.isApproved ? 'selected' : ''}>Approved</option>
                    <option value="false" ${!patient.isApproved ? 'selected' : ''}>Declined</option>
                    <option value="pending" ${!patient.isApproved ? 'selected' : ''}>Pending</option>
                </select>
            </div>
        </div>
        <div class="flex space-x-2">
            <button class="p-3 bg-white rounded-lg shadow hover:bg-gray-300" type="submit">Submit</button>
        </div>
    </form>
        `;
        
        return accountDiv;
    }

    async function displayAccounts() {
        const accounts = await fetchAccountData();
        const container = document.getElementById('editUser');
        
        const accountElement = createAccountElement(accounts.patient);
        container.appendChild(accountElement);
    }

    displayAccounts();
});