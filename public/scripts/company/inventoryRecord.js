document.addEventListener("DOMContentLoaded", async() => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    const tableList = document.getElementById('table-list');

    tableList.innerHTML = `
        <thead>
            <tr class="h-12 bg-gray-200">
            <th class="px-4 py-2 border border-gray-400">Entry ID</th>
            <th class="px-4 py-2 border border-gray-400">Date of Entry</th>
            <th class="px-4 py-2 border border-gray-400">Medicine</th>
            <th class="px-4 py-2 border border-gray-400">Quantity</th>
            <th class="px-4 py-2 border border-gray-400">Medicine Expiry Date</th>
            <th class="px-4 py-2 border border-gray-400">Status</th>
            <th class="px-4 py-2 border border-gray-400"> </th>
            </tr>
        </thead>
    `;

    const companyId = sessionStorage.getItem('accountId');

    const fetchDrugRecord = await fetch(`/api/inventoryRecord/${companyId}`, {
        method: 'GET'
    })

    const drugRecordList = await fetchDrugRecord.json();

    drugRecordList.forEach((record) => {
        const tableItem = document.createElement('tbody');
        const entryDate = formatDate(record.dateOfEntry);
        const expiryDate = formatDate(record.expiryDate);
        const todayDate = new Date();
        
        const diffInMonths = Math.floor((expiryDate - todayDate) / (1000 * 60 * 60 * 24 * 30));
        let status;
        if (diffInMonths < 3) {
            status = "Warning";
        } else if (expiryDate < todayDate) {
            status = "Bad"
        } else {
            status = "Good"
        }
        
        tableItem.innerHTML = `
            <tr class="h-12">
                <td class="px-4 py-2 border border-gray-400">${record.drugRecordId}</td>
                <td class="px-4 py-2 border border-gray-400">${entryDate}</td>
                <td class="px-4 py-2 border border-gray-400">${record.drugName}</td>
                <td class="px-4 py-2 border border-gray-400">${record.availableDrug}/${record.totalDrug}</td>
                <td class="px-4 py-2 border border-gray-400">${expiryDate}</td>
                <td class="px-4 py-2 border border-gray-400">${status}</td>
                <td class="px-4 py-2 border border-gray-400 text-center"><button class="bg-btnprimary text-white px-6 py-2 rounded-2xl clear-stock" data-drug-record-id="${record.drugRecordId}">Clear Stock</button></td>
            </tr>
            `;
        tableList.appendChild(tableItem);
    });

    document.querySelectorAll('.clear-stock').forEach(button => {
        button.addEventListener('click', async() => {
            const drugRecordId = button.getAttribute('data-drug-record-id');

            if (drugTotalQuantity === drugAvailableQuantity) {
                const deleteResponse = await fetch(`/api/inventoryRecord/${drugRecordId}`, {
                    method: 'DELETE'
                })
            } else {
                const postResponse = await fetch(`/api/inventoryRecord/${drugRecordId}`, {
                    method: 'PUT'
                })
            };

            if (deleteResponse.ok || postResponse) {
                window.location.reload();
            } else {
                console.error('Failed to update drug record');
            }
        });
    });

    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    }

})