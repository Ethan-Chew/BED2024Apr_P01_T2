document.addEventListener("DOMContentLoaded", async() => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Handle Home Button Press
    document.getElementById('home-btn').addEventListener('click', () => {
        window.location.href = './companyHome.html';
    });

    const tableList = document.getElementById('table-list');
    const searchField = document.getElementById('search-field');

    // Get Company Information
    const companyId = sessionStorage.getItem('accountId');

    // Fetch GET request
    const fetchDrugRecord = await fetch(`/api/inventoryRecord/${companyId}`, {
        method: 'GET'
    })

    const drugRecordList = await fetchDrugRecord.json();

    // Generate the table
    const renderTableList = (records) => {
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

        records.forEach((record) => {
            const tableItem = document.createElement('tbody');
            const entryDate = formatDate(record.dateOfEntry);
            const expiryDate = formatDate(record.expiryDate);
            const todayDate = new Date();

            const diffInMonths = Math.floor((new Date(expiryDate) - todayDate) / (1000 * 60 * 60 * 24 * 30));
            let status;
            if (diffInMonths < 3) {
                status = "Warning";
            } else if (new Date(expiryDate) < todayDate) {
                status = "Bad";
            } else {
                status = "Good";
            }

            tableItem.innerHTML = `
                <tr class="h-12">
                    <td class="px-4 py-2 border border-gray-400">${record.drugRecordId}</td>
                    <td class="px-4 py-2 border border-gray-400">${entryDate}</td>
                    <td class="px-4 py-2 border border-gray-400">${record.drugName}</td>
                    <td class="px-4 py-2 border border-gray-400">${record.availableDrug}/${record.totalDrug}</td>
                    <td class="px-4 py-2 border border-gray-400">${expiryDate}</td>
                    <td class="px-4 py-2 border border-gray-400">${status}</td>
                    <td class="px-4 py-2 border border-gray-400 text-center">
                    <button class="bg-btnprimary text-white px-6 py-2 rounded-2xl clear-stock" 
                    data-drug-record-id="${record.drugRecordId}"
                    data-drug-total-quantity="${record.totalDrug}"
                    data-drug-available-quantity="${record.availableDrug}">
                    Clear Stock
                    </button>
                    </td>
                </tr>
            `;
            tableList.appendChild(tableItem);
        });

        document.querySelectorAll('.clear-stock').forEach(button => {
            button.addEventListener('click', async() => {
                const drugRecordId = button.getAttribute('data-drug-record-id');
                const drugTotalQuantity = button.getAttribute('data-drug-total-quantity');
                const drugAvailableQuantity = button.getAttribute('data-drug-available-quantity');

                if (drugTotalQuantity === drugAvailableQuantity) {
                    const deleteResponse = await fetch(`/api/inventoryRecord/${drugRecordId}`, {
                        method: 'DELETE'
                    });
                    if (deleteResponse.ok) {
                        const response = await deleteResponse.json();
                        alert(response.message);
                        window.location.reload();
                    } else {
                        console.error('Failed to delete drug record');
                    }
                } else {
                    const postResponse = await fetch(`/api/inventoryRecord/${drugRecordId}`, {
                        method: 'PUT',
                    });
                    if (postResponse.ok) {
                        const response = await postResponse.json();
                        alert(response.message);
                        window.location.reload();
                    } else {
                        console.error('Failed to update drug record');
                    }
                }
            });
        });
    };

    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    }

    // Initial render of the table list
    renderTableList(drugRecordList);

    // Add event listener to the search field
    searchField.addEventListener('input', (event) => {
        const searchValue = event.target.value.toLowerCase();
        const filteredRecords = drugRecordList.filter((record) => {
            const status = (() => {
                const todayDate = new Date();
                const expiryDate = new Date(record.expiryDate);
                const diffInMonths = Math.floor((expiryDate - todayDate) / (1000 * 60 * 60 * 24 * 30));
                if (diffInMonths < 3) return "Warning";
                else if (expiryDate < todayDate) return "Bad";
                else return "Good";
            })().toLowerCase();

            return record.drugName.toLowerCase().includes(searchValue) || status.includes(searchValue);
        });
        renderTableList(filteredRecords);
    });
})