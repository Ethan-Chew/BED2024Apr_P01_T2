document.addEventListener("DOMContentLoaded", async() => {
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

    // Get Drug Orders
    const fetchDrugOrders = await fetch('/api/drugRequests', {
        method: 'GET'
    });
    const drugOrders = await fetchDrugOrders.json();
    console.log("Drug Orders: ", drugOrders);

    const requestList = document.getElementById('requests-list');
    requestList.innerHTML = '';
    drugOrders.forEach((order) => {
        console.log("Order: ", order);
        // Create a div element for the request item
        const requestItem = document.createElement('div');
        requestItem.className = 'w-full bg-gray-200 px-6 py-4 text-2xl rounded-3xl flex flex-row gap-5 align-center items-center justify-between';

        const requestDate = order.requestDate;
        const date = new Date(requestDate);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' }); // Get the month as full name
        const year = date.getFullYear(); // Get the full year
        const customFormattedDate = `${day} ${month} ${year}`;
        // Log properties to debug
        console.log("Drug Name: ", order.drugName);
        console.log("Drug Quantity: ", order.drugQuantity);
        console.log("Drug Price: ", order.drugPrice);
        console.log("Appointment ID: ", order.appointmentId);
        console.log("Request Date: ", order.requestDate, " OR ", customFormattedDate);

        requestItem.innerHTML = `
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
                    <!--Price-->
                    <div>
                        <p class="font-bold">Price/Unit</p>
                        <p class="text-xl">$${order.drugPrice}</p>
                    </div>
                </div>
                <!--Column 2-->
                <div class="flex flex-col gap-y-4">
                    <!--Order ID-->
                    <div>
                        <p class="font-bold">Appointment ID</p>
                        <p class="text-xl">${order.appointmentId}</p>
                    </div>
                    <!--Date of Request-->
                    <div>
                        <p class="font-bold">Date of Request</p>
                        <p class="text-xl">${customFormattedDate}</p>
                    </div>
                </div>
            </div>
            <!--Button-->
            <div>
                <button class="bg-btnprimary text-white px-6 py-4 rounded-2xl font-bold text-center contribute-btn"
                    data-appointment-id="${order.appointmentId}"
                    data-drug-name="${order.drugName}">
                    Contribute
                </button>
            </div>
        `;
        requestList.appendChild(requestItem);
    });

    // Add event listeners to the contribute buttons
    document.querySelectorAll('.contribute-btn').forEach(button => {
        button.addEventListener('click', () => {
            const appointmentId = button.getAttribute('data-appointment-id');
            const drugName = button.getAttribute('data-drug-name');
            window.location.href = `requestConfirmation.html?appointmentId=${appointmentId}&drugName=${encodeURIComponent(drugName)}`;
        });
    });

    
})