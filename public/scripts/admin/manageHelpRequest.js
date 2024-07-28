document.addEventListener('DOMContentLoaded', function() {
    async function fetchRequestData() {
        const response = await fetch('/api/admin/paymentRequests/');
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
                    <div>${request.id}</div>
                </div>
                <div>
                    <div class="font-bold">Appointment ID</div>
                    <div>${request.appointmentId}</div>
                </div>
                <div>
                    <div class="font-bold">Request Message</div>
                    <div>${request.message}</div>
                </div>
                <div>
                    <div class="font-bold">Request Status</div>
                    <div>${request.status}</div>
                </div>
            </div>
            <div class="flex space-x-2">
            <button class="approve-btn p-3 bg-white rounded-lg shadow hover:bg-gray-300">Approve</button>
                <button class="deny-btn p-3 bg-white rounded-lg shadow hover:bg-gray-300">Reject</button>
            </div>
        `;

        const approveBtn = requestDiv.querySelector('.approve-btn');
        approveBtn.addEventListener('click', () => handleApproveRequest(request.id));

        const denyBtn = requestDiv.querySelector('.deny-btn');
        denyBtn.addEventListener('click', () => handleRejectRequest(request.id));
        
        return requestDiv;
    }

    async function handleApproveRequest(requestId) {

        const updateResponse = await fetch(`/api/admin/paymentRequest/approve/${requestId}`, {
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

        const updateResponse = await fetch(`/api/admin/paymentRequest/reject/${requestId}`, {
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

    async function displayRequests(searchTerm = '') {
        const request = await fetchRequestData();
        const container = document.getElementById('viewRequest');
        container.innerHTML = '';
    
        const filteredRequests = request.requests.filter(request => 
            request.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        filteredRequests.forEach(request => {
            const requestElement = createRequestElement(request);
            container.appendChild(requestElement);
        });
    }
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        displayRequests(searchTerm);
    });

    displayRequests();
});