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

    // Get Company ID from sessionStorage
    const companyId = sessionStorage.getItem('accountId');

    // Get Companay Name
    const fetchCompany = await fetch(`/api/company/${companyId}`, {
        method: 'GET'
    });
    if (fetchCompany.status === 401 || fetchCompany.status === 403) {
        window.location.href = '../login.html';
    }

    // Get Drug Contribution Orders
    const fetchDrugContributionOrders = await fetch(`/api/drugContributionOrders/${companyId}`, {
        method: 'GET'
    });
    const drugContributionOrders = await fetchDrugContributionOrders.json();

    const contributionList = document.getElementById('contribution-list');

    // Function to render contribution orders
    const renderContributionOrders = (orders) => {
        contributionList.innerHTML = '';
        if (orders.length === 0) {
            contributionList.innerHTML = 'No Order Found';
        } else {
            orders.forEach((order) => {
                const contributionItem = document.createElement('div');
                contributionItem.className = 'w-full bg-gray-200 px-6 py-4 text-2xl rounded-3xl flex flex-row gap-5 align-center items-center justify-between';

                const contributeDate = order.contributeDate;
                const date = new Date(contributeDate);
                const day = date.getDate();
                const month = date.toLocaleString('en-US', { month: 'long' }); // Get the month as full name
                const year = date.getFullYear(); // Get the full year
                const customFormattedDate = `${day} ${month} ${year}`;

                let customConfirmationDate = 'Pending';
                if (order.confirmationDate !== null) {
                    const confirmationDate = order.confirmationDate;
                    const date2 = new Date(confirmationDate);
                    const day2 = date2.getDate();
                    const month2 = date2.toLocaleString('en-US', { month: 'long' }); // Get the month as full name
                    const year2 = date2.getFullYear(); // Get the full year
                    customConfirmationDate = `${day2} ${month2} ${year2}`;
                }

                contributionItem.innerHTML = `
                    <!--Information-->
                    <div class="flex flex-row px-6 py-4 gap-8">
                        <!--Column 1-->
                        <div class="flex flex-col gap-y-4">
                            <!--Medicine Name-->
                            <div>
                                <p class="font-bold">Medicine Name</p>
                                <p class="text-xl">${order.drugName}</p>
                            </div>
                            <!--Quantity Requested-->
                            <div>
                                <p class="font-bold">Quantity Requested</p>
                                <p class="text-xl">${order.drugQuantity}</p>
                            </div>
                            <!--Total Cost-->
                            <div>
                                <p class="font-bold">Total Cost</p>
                                <p class="text-xl">$${order.totalCost.toFixed(2)}</p>
                            </div>
                        </div>
                        <!--Column 2-->
                        <div class="flex flex-col gap-y-4">
                            <div class="flex flex-row gap-12">
                                <!--Order ID-->
                                <div>
                                    <p class="font-bold">Appointment ID</p>
                                    <p class="text-xl">${order.appointmentId}</p>
                                </div>
                                <!--Status-->
                                <div>
                                    <p class="font-bold">Status</p>
                                    <p class="text-xl">${order.contributionStatus}</p>
                                </div>
                            </div>
                            <!--Date of Order-->
                            <div>
                                <p class="font-bold">Date of Order</p>
                                <p class="text-xl">${customFormattedDate}</p>
                            </div>
                            <!--Date of Confirmation-->
                            <div>
                                <p class="font-bold">Date of Confirmation</p>
                                <p class="text-xl">${customConfirmationDate}</p>
                            </div>
                        </div>
                    </div>
                    <!--Button-->
                    <div class="flex flex-col gap-4">
                        <button class="${order.contributionStatus === 'Completed' ? 'bg-red-500' : 'bg-btnprimary'} text-white px-6 py-4 rounded-2xl font-bold text-center confirm-btn ${order.contributionStatus === 'Completed' ? 'cursor-not-allowed' : 'hover:cursor-pointer'}"
                        data-appointment-id="${order.appointmentId}"
                        data-drug-name="${order.drugName}"
                        ${order.contributionStatus === 'Completed' ? 'disabled' : ''}>
                        Confirm request</button>
                        <button class="${order.contributionStatus === 'Completed' ? 'bg-red-500' : 'bg-btnprimary'} text-white px-6 py-4 rounded-2xl font-bold text-center cancel-btn ${order.contributionStatus === 'Completed' ? 'cursor-not-allowed' : 'hover:cursor-pointer'}"
                        data-appointment-id="${order.appointmentId}"
                        data-drug-record-id="${order.drugRecordId}"
                        data-drug-name="${order.drugName}"
                        ${order.contributionStatus === 'Completed' ? 'disabled' : ''}>
                        Cancel
                        </button>
                    </div>
                `;
                contributionList.appendChild(contributionItem);
            });
        }

        // Add event listeners to the confirm buttons
        document.querySelectorAll('.confirm-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const appointmentId = button.getAttribute('data-appointment-id');
                const drugName = button.getAttribute('data-drug-name');

                 try {
                    const response = await fetch(`/api/drugContributionOrders/${appointmentId}/${drugName}`, {
                        method: 'PUT'
                    });

                    if (response.ok) {
                        // Optionally handle the response if needed
                        const data = await response.json();
                        
                        window.location.reload();
                    } else {
                        console.error('Failed to confirm drug order:', response.statusText);
                        // Handle error scenario if necessary
                    }
                } catch (error) {
                    console.error('Error confirming drug order:', error);
                    // Handle network or other errors
                }
            });
        });

        // Add event listeners to the cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const appointmentId = button.getAttribute('data-appointment-id');
                const drugRecordIdAttr = button.getAttribute('data-drug-record-id');
                const drugRecordId = drugRecordIdAttr !== 'null' ? drugRecordIdAttr : null;
                const drugName = button.getAttribute('data-drug-name');
        
                try {
                    // Change drug request status
                    const response2 = await fetch(`/api/drugRequest/${appointmentId}/${drugName}`, {
                        method: 'PUT'
                    });
                
                    let response3Ok = true;
                    if (drugRecordId !== null) { // Add drug quantity back to drug inventory
                        const response3 = await fetch(`/api/drugInventoryRecord/${drugRecordId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ appointmentId: appointmentId, drugName: drugName })
                        });
                        response3Ok = response3.ok;
                
                        if (!response3Ok) {
                            console.error('Failed to update drug inventory:', response3.statusText);
                        }
                    }
                
                    if (response2.ok && response3Ok) {
                        // Delete contribution record
                        const response = await fetch(`/api/drugContributionOrders/${appointmentId}/${drugName}`, {
                            method: 'DELETE'
                        });
                
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            console.error('Failed to delete drug order:', response.statusText);
                        }
                    } else {
                        console.error('Failed to process drug request:', response2.statusText, response3Ok ? '' : 'Drug inventory update failed');
                    }
                } catch (error) {
                    console.error('Error occurred while handling order:', error);
                }
            });
        });
    };

    // Initial render
    renderContributionOrders(drugContributionOrders);

    // Add event listener to the search field
    const searchField = document.getElementById('search-field');
    searchField.addEventListener('input', (event) => {
        const searchValue = event.target.value.toLowerCase();
        const filteredOrders = drugContributionOrders.filter((order) => {
            return order.drugName.toLowerCase().includes(searchValue);
        });
        renderContributionOrders(filteredOrders);
    });

});