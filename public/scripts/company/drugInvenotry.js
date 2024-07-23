document.addEventListener('DOMContentLoaded', async () => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Handle Home Button Press
    document.getElementById('home-btn').addEventListener('click', () => {
        window.location.href = './companyHome.html';
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

    const companyId = sessionStorage.getItem('accountId');

    // Get Companay Name
    const fetchCompany = await fetch(`/api/company/${companyId}`, {
        method: 'GET'
    });
    if (fetchCompany.status === 401 || fetchCompany.status === 403) {
        window.location.href = '../login.html';
    }

    // Initially disable buttons
    emptyBtn.disabled = true;
    editBtn.disabled = true;

    // Retrive List of drugs
    const fetchDrugNameList = await fetch(`/api/companyDrugInventory/`, {
        method: 'GET'
    });

    const drugNameList = await fetchDrugNameList.json();

    // Function to generate HTML
    const renderDrugList = (drugs) => {
        drugList.innerHTML = '';
        drugList.innerHTML = '<legend class="text-center mb-2">Select Medicine</legend>';

        if (!Array.isArray(drugs) || drugs.length === 0) {
            drugList.innerHTML = `
                <legend class="text-center mb-2">Select Medicine</legend>
                <p class="text-center">No Medicine Found</p>
            `;
        } else {
            drugs.forEach(drug => {
                const drugId = drug.replace(/ /g, '-');
                const drugItem = document.createElement('div');
                drugItem.className = 'w-full text-center';

                drugItem.innerHTML = `
                    <input class="peer/${drugId} appearance-none" type="radio" id="${drugId}" name="medicine" value="${drug}">
                    <label class="peer-checked/${drugId}:bg-black peer-checked/${drugId}:text-white" for="${drugId}">${drug}</label>
                `;

                drugList.appendChild(drugItem);
            });
        }
        // Add eventListner to the radio buttons
        document.addEventListener('change', event => {
            if (event.target.name === 'medicine') {
                const selectedDrug = event.target.value;
                showDrugInfo(selectedDrug, companyId);
                emptyBtn.disabled = false;
                editBtn.disabled = false;
                emptyBtn.removeEventListener('click', handleEmptyInventory);
                emptyBtn.addEventListener('click', handleEmptyInventory);
            }
        });
    };

    // Initial render of the drug list
    renderDrugList(drugNameList);

    // Add event listener to the search field
    const searchField = document.getElementById('search-field');
    searchField.addEventListener('input', (event) => {
        const searchValue = event.target.value.toLowerCase();
        const filteredDrugs = drugNameList.filter((drug) => {
            return drug.toLowerCase().includes(searchValue);
        });
        renderDrugList(filteredDrugs);
    });

    // Show Drug Details
    async function showDrugInfo(drug, companyId) {
        const fetchDrugInformation = await fetch(`/api/companyDrugInventory/${companyId}/${drug}`, {
            method: 'GET'
        });
        if (!fetchDrugInformation.ok) {
            throw new Error('Network response was not ok');
        }
        const drugInformation = await fetchDrugInformation.json();
        drugName.innerHTML = drugInformation[0].drugName;
        drugExpiryClose.innerHTML = drugInformation[0].drugExpiryDateClose === null ? 'N.A' : formatDate(drugInformation[0].drugExpiryDateClose);
        drugExpiryFar.innerHTML = drugInformation[0].drugExpiryDateFar === null ? 'N.A' : formatDate(drugInformation[0].drugExpiryDateFar);
        drugQuantity.innerHTML = drugInformation[0].drugQuantity + ' Pills';
        drugPrice.innerHTML = '$' + drugInformation[0].drugPrice;
        drugInfo.innerHTML = drugInformation[0].drugDescription;
        editBtn.setAttribute('data-DrugName', drugInformation[0].drugName);
        
        // Disable empty button if drugQuantity is 0
        if (drugInformation[0].drugQuantity === 0) {
            emptyBtn.disabled = true;
            emptyBtn.classList.add('cursor-not-allowed');
            emptyBtn.classList.remove('cursor-pointer');
        } else {
            emptyBtn.disabled = false;
            emptyBtn.classList.add('cursor-pointer');
            emptyBtn.classList.remove('cursor-not-allowed');
        }
    }
    // Add event listener to edit button
    editBtn.addEventListener('click', () => {
        const drug = editBtn.getAttribute('data-DrugName');
        window.location.href = `editDrugInventory.html?drugName=${drug}`;
    });

    async function emptyInventory(drug, companyId) {
        try {
            const fetchEmptyInventory = await fetch(`/api/companyDrugInventory/${companyId}/${drug}`, {
                method: 'DELETE'
            });
            if (!fetchEmptyInventory.ok) {
                throw new Error('Network response was not ok');
            }
            showDrugInfo(drug, companyId);
        } catch (error) {
            console.error('Error emptying inventory:', error);
        }
    }
    // Function to format date
    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    }

    function handleEmptyInventory() {
        const selectedDrug = document.querySelector('input[name="medicine"]:checked').value;
        emptyInventory(selectedDrug, companyId);
    }
});