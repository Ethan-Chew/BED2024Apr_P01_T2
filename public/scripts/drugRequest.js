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

    const requestList = document.getElementById('requests-list');
    requestList.innerHTML = '';
    drugOrders.forEach(order => {
          // Create a div element for the request item
        const requestItem = document.createElement('div');
        requestItem.className = 'w-full bg-gray-200 px-6 py-4 text-2xl rounded-3xl flex flex-row gap-5 align-center items-center justify-between';

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
                        <p class="text-xl">${order.requestDate}</p>
                    </div>
                </div>
            </div>
            <!--Button-->
            <div>
                <a class="bg-btnprimary text-white px-6 py-4 rounded-2xl font-bold text-center" href="requestConfirmation.html" id="request-contribute-${order.appointmentId}-${order.drugName}">Contribute</a>
            </div>
        `;
        requestList.appendChild(requestItem);
    });

})