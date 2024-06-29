document.addEventListener('DOMContentLoaded', function() {
    async function fetchRequestData() {
        const response = await fetch('/api/helpRequests/');
        return await response.json();
    }

    function createRequestElement(request) {
        const requestDiv = document.createElement('div');
        requestDiv.className = 'p-6 bg-gray-200 rounded-lg shadow flex justify-between items-center';
        
        // Populate request information
        requestDiv.innerHTML = `
            <div class="flex-1 grid grid-cols-2 gap-x-10 gap-y-2 pr-20">
                <div>
                    <div class="font-bold">Request ID</div>
                    <div>${request.PaymentRequestId}</div>
                </div>
                <div>
                    <div class="font-bold">Appointment ID</div>
                    <div>${request.AppointmentId}</div>
                </div>
                <div>
                    <div class="font-bold">Request Message</div>
                    <div>${request.PaymentRequestMessage}</div>
                </div>
                <div>
                    <div class="font-bold">Request Status</div>
                    <div>${request.PaymentRequestStatus}</div>
                </div>
            </div>
            <div class="flex space-x-2">
            <button class="approve-btn p-3 bg-white rounded-lg shadow hover:bg-gray-300">Approve</button>
                <button class="deny-btn p-3 bg-white rounded-lg shadow hover:bg-gray-300">Reject</button>
            </div>
        `;

        const approveBtn = requestDiv.querySelector('.approve-btn');
        approveBtn.addEventListener('click', () => handleApproveRequest(request.PaymentRequestId));

        const denyBtn = requestDiv.querySelector('.deny-btn');
        denyBtn.addEventListener('click', () => handleRejectRequest(request.PaymentRequestId));
        
        return requestDiv;
    }

    async function handleApproveRequest(requestId) {

        const updateResponse = await fetch(`/api/helpRequests/approve/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (updateResponse.status === 200) {    
            window.location.reload();
        } else {
            alert("Error: Unable to approve request.");
        }

    }

    async function handleRejectRequest(requestId) {

        const updateResponse = await fetch(`/api/helpRequests/reject/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (updateResponse.status === 200) {    
            window.location.reload();
        } else {
            alert("Error: Unable to deny request.");
        }
        
    }

    async function displayRequests() {
        const requests = await fetchRequestData();
        const container = document.getElementById('viewRequest');
        
        requests.requests.forEach(request => {
            const requestElement = createRequestElement(request);
            container.appendChild(requestElement);
        });
    }

    displayRequests();
});