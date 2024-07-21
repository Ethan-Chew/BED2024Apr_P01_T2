document.addEventListener('DOMContentLoaded', async () => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Get Company Information
    const companyId = sessionStorage.getItem('accountId');

    // Get Companay Name
    const fetchCompany = await fetch(`/api/company/${companyId}`, {
        method: 'GET'
    });
    const companyJson = await fetchCompany.json();

    // Get Drug Orders
    const fetchDrugOrders = await fetch('/api/drugRequests/', {
        method: 'GET'
    });
    const drugOrders = await fetchDrugOrders.json();

    // Display Company Information
    document.getElementById('company-name').innerText = companyJson.name;
    document.getElementById('pending-request').innerText = drugOrders.length;

    // Add event listener
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
    document.getElementById('view-account').addEventListener('click', () => {
        window.location.href = '../company/companyAccountScreen.html';
    })
})