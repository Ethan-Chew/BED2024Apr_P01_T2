document.addEventListener('DOMContentLoaded', function() {
    async function fetchAccountData() {
        const urlParams = new URLSearchParams(window.location.search);
        const accountId = urlParams.get('id');
        const response = await fetch(`/api/questionnaire/${accountId}`);
        return await response.json();
    }

    function createAccountElement(account) {
        const accountDiv = document.createElement('div');
        accountDiv.className = 'p-6 bg-gray-200 rounded-lg shadow flex justify-between items-center';
        
        // Populate account information
        accountDiv.innerHTML = `
            <div class="flex-1 grid grid-cols-2 gap-x-10 gap-y-2 pr-20">
                <div>
                    <div class="font-bold">Question 1</div>
                    <div>${account.QOne}</div>
                </div>
                <div>
                    <div class="font-bold">Question 2</div>
                    <div>${account.QTwo}</div>
                </div>
                <div>
                    <div class="font-bold">Question 3</div>
                    <div>${account.QThree}</div>
                </div>
                <div>
                    <div class="font-bold">Question 4</div>
                    <div>${account.QFour}</div>
                </div>
                <div>
                    <div class="font-bold">Question 5</div>
                    <div>${account.QFive}</div>
                </div>
                <div>
                    <div class="font-bold">Question 6</div>
                    <div>${account.QSix}</div>
                </div>
            </div>
            <div class="flex space-x-2">
                <a class="p-3 bg-white rounded-lg shadow hover:bg-gray-300">Approve</a>
                <a class="p-3 bg-white rounded-lg shadow hover:bg-gray-300">Deny</a>
            </div>
        `;
        
        return accountDiv;
    }

    async function displayAccounts() {
        const accounts = await fetchAccountData();
        const container = document.getElementById('viewPatientQuestionnaire');
        
        const accountElement = createAccountElement(accounts.patient);
        container.appendChild(accountElement);
    }

    displayAccounts();
});