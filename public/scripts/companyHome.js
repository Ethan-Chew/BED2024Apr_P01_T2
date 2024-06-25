document.addEventListener('DOMContentLoaded', async () => {
    // Check that User is a Company
    if (sessionStorage.getItem('accountType') !== 'company') {
        window.location.href = '../login.html';
        return;
    }

    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Get Company Information
    const companyId = sessionStorage.getItem('accountId');
    console.log(companyId);
    const fetchCompany = await fetch(`/api/company/${companyId}`, {
        method: 'GET'
    });
    const companyJson = await fetchCompany.json();
    console.log("companyJson: ", companyJson);

    // Display Company Information
    document.getElementById('company-name').innerText = companyJson.name;

    document.getElementById('view-request').addEventListener('click', () => {
        window.location.href = '../company/drugRequest.html';
    })
    document.getElementById('view-order').addEventListener('click', () => {
        window.location.href = '../company/drugOrder.html';
    })
    document.getElementById('view-inventory').addEventListener('click', () => {
        window.location.href = '../company/drugInventory.html';
    })
    document.getElementById('view-record').addEventListener('click', () => {
        window.location.href = '../company/inventoryRecord.html';
    })
    //document.getElementById('pending-request').innerHTML = '';
})