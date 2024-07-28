document.addEventListener('DOMContentLoaded', function() {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });
    
    async function fetchAccountData() {
        const urlParams = new URLSearchParams(window.location.search);
        const accountId = urlParams.get('id');
        const response = await fetch(`/api/questionnaire/${accountId}`);
        return await response.json();
    }

    function createAccountElement(account) {
        const urlParams = new URLSearchParams(window.location.search);
        const accountId = urlParams.get('id');
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
                <a class="approve-btn p-3 bg-white rounded-lg shadow hover:bg-gray-300">Approve</a>
                <a class="deny-btn p-3 bg-white rounded-lg shadow hover:bg-gray-300">Deny</a>
            </div>
        `;

        const approveBtn = accountDiv.querySelector('.approve-btn');
        approveBtn.addEventListener('click', () => approve(accountId));

        const denyBtn = accountDiv.querySelector('.deny-btn');
        denyBtn.addEventListener('click', () => deny(accountId));
        
        return accountDiv;
    }

    async function approve(accountId) {
        try {
            const approve = await fetch(`/api/patient/approve/${accountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (approve.status !== 200) {
                alert(`Error: Unable to approve account. ${errorText}`);
            } else {
                alert("Account approved successfully.");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error approve account:", error);
            alert("Error: Unable to approve account. Please try again later.");
        }
    }

    async function deny(accountId) {
        try {
            const deny = await fetch(`/api/patient/reject/${accountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (deny.status !== 200) {
                alert(`Error: Unable to deny account. ${errorText}`);
            } else {
                alert("Account denied successfully.");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deny account:", error);
            alert("Error: Unable to deny account. Please try again later.");
        }
    }

    async function displayAccounts() {
        const accounts = await fetchAccountData();
        const container = document.getElementById('viewPatientQuestionnaire');
        
        const accountElement = createAccountElement(accounts.patient);
        container.appendChild(accountElement);
    }

    displayAccounts();
});