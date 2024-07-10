document.addEventListener("DOMContentLoaded", async() => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    const drugName = document.getElementById('drug-name');
    const drugExpiryClose = document.getElementById('expiry-date-close');
    const drugExpiryFar = document.getElementById('expiry-date-far');
    const drugQuantity = document.getElementById('drug-quantity');
    const drugPrice = document.getElementById('drug-price');
    const drugInfo = document.getElementById('drug-info');
    const addQuantity = document.getElementById('add-qtn');
    const addExpiryDate = document.getElementById('expiry-date-add');
    const addBtn = document.getElementById('add-btn');
    const removeQuantity = document.getElementById('remove-qtn');
    const removeBtn = document.getElementById('remove-btn');

    const urlParams = new URLSearchParams(window.location.search)
    const companyId = urlParams.get('companyId');
    const drug = urlParams.get('drugName');

    // Show Drug Details
    async function showDrugInfo(drug, companyId) {
        const fetchDrugInformation = await fetch(`/api/companyDrugInventory/${companyId}/${drug}`, {
            method: 'GET'
        })
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
    }

    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    }

    showDrugInfo(drug, companyId);


    // Add Drug into Drug Inventory
    addBtn.addEventListener('click', async() => {
        const quantity = addQuantity.value;
        const expiryDate = addExpiryDate.value.trim();

        // Validate quantity and expiry date format
        if (quantity === '' || expiryDate === '') {
            alert('Please fill in all fields');
            return;
        }

        // Validate quantity is more than 0
        if (parseInt(quantity) <= 0 || isNaN(parseInt(quantity))) {
            alert('Quantity must be a valid number greater than 0');
            return;
        }

        // Validate expiry date format (YYYY-MM-DD)
        if (!isValidDateFormat(expiryDate)) {
            alert('Please enter a valid date in YYYY-MM-DD (2024-12-31) format');
            return;
        }

        const data = {
            drugName: drug,
            drugQuantity: quantity,
            drugExpiryDate: expiryDate,
            companyId: companyId
        }
        const addDrug = await fetch('/api/companyDrugInventory/addDrug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!addDrug.ok) {
            throw new Error('Network response was not ok');
        }
        const response = await addDrug.json();
        if (response.message) {
            alert(response.message);
            window.location.reload();
        }
    });

    function isValidDateFormat(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex pattern for YYYY-MM-DD format
        return regex.test(dateString);
    }

})