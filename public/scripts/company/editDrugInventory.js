document.addEventListener("DOMContentLoaded", async() => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Handle Back Button Press
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = './drugInventory.html';
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

    const urlParams = new URLSearchParams(window.location.search);
    const companyId = sessionStorage.getItem('accountId');
    const drug = urlParams.get('drugName');

    // Get Companay Name
    const fetchCompany = await fetch(`/api/company/${companyId}`, {
        method: 'GET'
    });
    if (fetchCompany.status === 401 || fetchCompany.status === 403) {
        window.location.href = '../login.html';
    }

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
    }
    // Function to format date
    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    }

    // Render Drug Information
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

        if (isDateInThePast(expiryDate)) {
            alert('The date cannot be in the past. Please enter a valid future date.');
            return;
        }

        const data = {
            drugName: drug,
            drugQuantity: quantity,
            drugExpiryDate: expiryDate,
            companyId: companyId
        };
        // Fetch POST request
        const addDrug = await fetch('/api/companyDrugInventory/addDrug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!addDrug.ok) {
            throw new Error('Network response was not ok');
        }

        const response = await addDrug.json();
        if (response.message) {
            alert(response.message);
            window.location.reload();
        }
    });

    // Add event listener to remove drug from inventory
    removeQuantity.addEventListener('input', () => {
        const quantity = parseInt(removeQuantity.value.trim());
        const availableQuantity = parseInt(drugQuantity.textContent.split(' ')[0]);
        if (quantity > availableQuantity) {
            alert('Quantity to remove exceeds available quantity');
            removeQuantity.value = availableQuantity;
        }
    });

    // Remove Drug from Drug Inventory
    removeBtn.addEventListener('click', async() => {
        const quantity = removeQuantity.value.trim();

         // Validate quantity
        if (quantity === '') {
            alert('Please fill in the quantity');
            return;
        }

        // Validate quantity is a positive integer
        if (parseInt(quantity) <= 0 || isNaN(parseInt(quantity))) {
            alert('Quantity must be a valid number greater than 0');
            return;
        }

        try {
            // Fetch DELETE request
            const removeDrug = await fetch(`/api/companyDrugInventory/${companyId}/${drug}/${quantity}`, {
                method: 'DELETE'
            });
    
            if (!removeDrug.ok) {
                throw new Error('Network response was not ok');
            }
    
            const response = await removeDrug.json();
            if (response.message) {
                alert(response.message);
                window.location.reload();
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    // Function to validate date format (YYYY-MM-DD)
    function isValidDateFormat(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex pattern for YYYY-MM-DD format
        return regex.test(dateString);
    }

    // Function to check if a date is in the past
    function isDateInThePast(dateString) {
        const inputDate = new Date(dateString);
        const today = new Date();

        // Set time to the beginning of the day to avoid time component issues
        today.setHours(0, 0, 0, 0);

        // Compare dates
        return inputDate <= today;
    }
});
