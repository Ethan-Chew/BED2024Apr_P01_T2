document.addEventListener("DOMContentLoaded", async() => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    // Get Drug Contribution Orders
    const fetchDrugContributionOrders = await fetch('/api/drugContributionOrders', {
        method: 'GET'
    });
    const drugContributionOrders = await fetchDrugContributionOrders.json();
    //console.log("Drug Orders: ", drugContributionOrders);

    const contributionList = document.getElementById('contribution-list');
    contributionList.innerHTML = '';

    if (drugContributionOrders === null) {
        contributionList.innerHTML = 'No Order Found';
    } else {
        drugContributionOrders.forEach((order) => {
            //console.log("Order: ", order);
            // Create a div element for the request item
            const contributionItem = document.createElement('div');
            contributionItem.className = 'w-full bg-gray-200 px-6 py-4 text-2xl rounded-3xl flex flex-row gap-5 align-center items-center justify-between';
    
            const contributeDate = order.contributeDate;
            const date = new Date(contributeDate);
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' }); // Get the month as full name
            const year = date.getFullYear(); // Get the full year
            const customFormattedDate = `${day} ${month} ${year}`;
    
            let customConfirmationDate = 'Pending';
            if (order.confirmationDate !== null){
                const confirmationDate = order.confirmationDate;
                const date2 = new Date(confirmationDate);
                const day2 = date2.getDate();
                const month2 = date2.toLocaleString('en-US', { month: 'long' }); // Get the month as full name
                const year2 = date2.getFullYear(); // Get the full year
                customConfirmationDate = `${day2} ${month2} ${year2}`;
                //console.log(customConfirmationDate);
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
                </div
                <!--Button-->
                <div class="flex flex-col gap-4">
                    <button class="bg-btnprimary text-white px-6 py-4 rounded-2xl font-bold text-center confirm-btn">Confirm request</button>
                    <button class="bg-btnprimary text-white px-6 py-4 rounded-2xl font-bold text-center cancel-btn"
                    data-appointment-id="${order.appointmentId}"
                    data-drug-name="${order.drugName}">
                    Cancel
                    </button>
                </div>
            `;
            contributionList.appendChild(contributionItem);
        });
    }

    

    // Handle Confirm Button Press
    document.querySelectorAll('.confirm-btn').forEach(button => {
        button.addEventListener('click', async() => {
            window.location.href = 'companyHome.html';
        });
    });

    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const appointmentId = button.getAttribute('data-appointment-id');
            const drugName = button.getAttribute('data-drug-name');
    
            try {
                // First fetch for DELETE request
                const response = await fetch(`/api/drugContributionOrders/${appointmentId}/${drugName}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    // Parse the response from DELETE request
                    const cancelOrder = await response.json();
    
                    // Second fetch for POST request
                    const response2 = await fetch(`/api/drugRequest/${appointmentId}/${drugName}`, {
                        method: 'POST'
                    });
    
                    if (response2.ok) {
                        // Parse the response from POST request
                        const cancelOrder2 = await response2.json();
                        //console.log("Cancel Order:", cancelOrder, " + ", cancelOrder2);
                        
                        // Redirect only if both requests are successful
                        window.location.href = 'companyHome.html';
                    } else {
                        console.error('Failed to process drug request:', response2.statusText);
                        // Optionally, you can show an error message to the user here
                    }
                } else {
                    console.error('Failed to delete drug order:', response.statusText);
                    // Optionally, you can show an error message to the user here
                }
            } catch (error) {
                console.error('Error occurred while handling order:', error);
                // Optionally, you can show an error message to the user here
            }
        });
    });
})