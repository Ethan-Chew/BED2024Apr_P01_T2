document.addEventListener("DOMContentLoaded", async() => {
    // Handle Cancel Button Press
    document.getElementById('cancel-btn').addEventListener('click', () => {
        window.location.href = 'drugRequest.html';
    });

    // Handle Back Button Press
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = './drugRequest.html';
    });    

    // Get the parameters for fetching the drug order details
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get('appointmentId');
    const drugName = urlParams.get('drugName');
    const companyId = sessionStorage.getItem('accountId');

    // Get Companay Name
    const fetchCompany = await fetch(`/api/company/${companyId}`, {
        method: 'GET'
    });
    if (fetchCompany.status === 401 || fetchCompany.status === 403) {
        window.location.href = '../login.html';
    }

    if (!appointmentId || !drugName) {
        console.error('Missing appointmentId or drugName in query parameters');
        return;
    }

    // Fetch Drug Order
    try {
        const response = await fetch(`/api/drugRequest/${appointmentId}/${drugName}/${companyId}`, {
            method: 'GET'
        });
        const drugOrder = await response.json();

        if (response.ok && drugOrder) {
            populateDrugOrderInfo(drugOrder);
        } else {
            console.error('Failed to fetch drug order:', drugOrder.error || response.statusText);
        }
    } catch (err) {
        console.error('Error fetching drug order:', err);
    }


    // Selecting elements
    const inputInventory = document.getElementById('input-inventory');
    const inputExcess = document.getElementById('input-excess');
    const contributeQuantityElement = document.getElementById('contribute-quantity');
    const requestQuantityElement = document.getElementById("request-quantity");

    // Event listeners for input fields
    inputInventory.addEventListener('input', updateContributeQuantity);
    inputExcess.addEventListener('input', updateContributeQuantity);
    // Restrict input to numbers only and ensure no negative values
    inputInventory.addEventListener('input', restrictToNumbers);
    inputExcess.addEventListener('input', restrictToNumbers);

    function restrictToNumbers(event) {
        const value = event.target.value;
        event.target.value = value.replace(/\D/g, '');
        // Ensure value does not go below 0
        if (parseInt(event.target.value) < 0 || event.target.value === '') {
            event.target.value = 0;
        }
    }

    // Function to update contribute quantity based on inputs
    function updateContributeQuantity() {
        // Get values from inputs, defaulting to 0 if input is empty or NaN
        let inventoryQuantity = parseInt(inputInventory.value) || 0;
        let excessQuantity = parseInt(inputExcess.value) || 0;

        // Get the drugAvailableQuantity from the drug order info
        const drugAvailableQuantity = parseInt(document.getElementById("inventory-quantity").innerHTML);

        // Ensure inventoryQuantity doesn't exceed drugAvailableQuantity
        if (inventoryQuantity > drugAvailableQuantity) {
            inventoryQuantity = drugAvailableQuantity;
            inputInventory.value = inventoryQuantity;
        }

        // Calculate the maximum allowable contribution based on the requested quantity
        const maxContribution = parseInt(document.getElementById("request-quantity").innerHTML);

        // Validate and adjust input values if necessary
        if (inventoryQuantity > maxContribution) {
            inventoryQuantity = maxContribution;
            inputInventory.value = inventoryQuantity;
        }
        if (excessQuantity > maxContribution - inventoryQuantity) {
            excessQuantity = maxContribution - inventoryQuantity;
            inputExcess.value = excessQuantity;
        }

        // Calculate total contribution quantity
        const totalContribution = inventoryQuantity + excessQuantity;

        // Update the text content of contribute-quantity span
        contributeQuantityElement.textContent = totalContribution;
    }

    // Handle Confirm Button Press
    document.getElementById('confirm-btn').addEventListener('click', async () => {
        const totalContribution = parseInt(contributeQuantityElement.textContent);
        const maxContribution = parseInt(requestQuantityElement.textContent);
        const inventoryContribution = parseInt(inputInventory.value) || 0;

        if (totalContribution === maxContribution) {
            try {
                const totalCost = parseFloat(document.getElementById('price').innerText.replace('$', ''));

                // Execute both requests in sequence to get recordId first
                const putResponse = await fetch(`/api/drugRequest/contribute/${companyId}/${appointmentId}/${drugName}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ contributedQuantity: inventoryContribution })
                });

                if (!putResponse.ok) {
                    const error = await putResponse.json();
                    throw new Error(`PUT request failed: ${error.error}`);
                }

                const { recordId } = await putResponse.json();

                const postResponse = await fetch(`/api/drugRequest/drugContribution`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        appointmentId,
                        drugName,
                        inventoryContribution: inventoryContribution,
                        contributionQuantity: totalContribution,
                        totalCost: parseFloat(totalCost),
                        contributeDate: getTodayDate(),
                        contributionStatus: 'Pending',
                        companyId: companyId,
                        drugRecordId: recordId.recordId
                    })
                });

                if (!postResponse.ok) {
                    const error = await postResponse.json();
                    throw new Error(`POST request failed: ${error.error}`);
                }
                
    
                if (postResponse.ok && putResponse.ok) {
                    // Redirect to the company home page
                    window.location.href = 'drugRequest.html';
                } else {
                    // Retrieve and log error details
                    const postError = postResponse.ok ? null : await postResponse.json();
                    const putError = putResponse.ok ? null : await putResponse.json();
                    
                    console.error('Failed to update drug request:', postError || postResponse.statusText, putError || putResponse.statusText);
                    alert('Failed to complete the drug request.');
                }
            } catch (err) {
                console.error('Error updating drug request:', err);
                alert('An error occurred while completing the drug request.');
            }
        } else {
            // Display an error message for incomplete contribution
            alert('Please contribute the required quantity.');
        }
        
    });
});

function populateDrugOrderInfo(order) {
    document.getElementById("inventory-quantity").innerHTML = order.drugAvailabilityQuantity;
    document.getElementById("price").innerHTML = '$' + (order.drugPrice * order.drugQuantity).toFixed(2);
    document.getElementById("request-quantity").innerHTML = order.drugQuantity;
    document.getElementById("appointment-id").innerHTML = order.appointmentId;
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
