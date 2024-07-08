document.addEventListener('DOMContentLoaded', async () => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    const drugList = document.getElementById('drug-list');
    const drugName = document.getElementById('drug-name');
    const drugExpiryClose = document.getElementById('expiry-date-close');
    const drugExpiryFar = document.getElementById('expiry-date-far');
    const drugQuantity = document.getElementById('drug-quantity');
    const drugPrice = document.getElementById('drug-price');
    const drugInfo = document.getElementById('drug-info');
    const emptyBtn = document.getElementById('empty-btn');
    const editBtn = document.getElementById('edit-btn');

    // Retrive List of drugs
    const fetchDrugNameList = await fetch('/api/companyDrugInventory/', {
        method: 'GET'
    });

    const drugNameList = await fetchDrugNameList.json();

    drugList.innerHTML = '';
    drugList.innerHTML = '<legend class="text-center mb-2">Select Medicine</legend>';

    if (!Array.isArray(drugNameList) || drugNameList.length === 0) {
        drugList.innerHtml = 'No Medicine Found';
    } else {
        drugNameList.forEach(drug => {
            const drugItem = document.createElement('div');
            drugItem.className = 'w-full text-center';

            drugItem.innerHTML = `
                <input class="peer/${drug} appearance-none" type="radio" id="${drug}" name="medicine" value="${drug}">
                <label class="peer-checked/${drug}:bg-black peer-checked/${drug}:text-white" for="${drug}">${drug}</label>
            `;

            drugList.appendChild(drugItem);
        })
    }

    document.addEventListener('change', event => {
        if (event.target.name === 'medicine') {
            const selectedDrug = event.target.value;
            showDrugInfo(selectedDrug);
        }
    })

    // Show Drug Details
    function showDrugInfo(drug) {
        drugName.innerHTML = drug;
    }
})