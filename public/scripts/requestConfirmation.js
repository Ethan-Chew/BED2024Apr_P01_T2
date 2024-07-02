document.addEventListener("DOMContentLoaded", async() => {
    // Handle Logout Button Press
    // document.getElementById('logout').addEventListener('click', () => {
    //     sessionStorage.removeItem('accountId');
    //     window.location.href = '../index.html';
    // });

    // Handle Cancel Button Press
    document.getElementById('cancel-btn').addEventListener('click', () => {
        window.location.href = 'drugRequest.html';
    });

    

    // Get the parameters for fetching the drug order details
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get('appointmentId');
    const drugName = urlParams.get('drugName');

    if (!appointmentId || !drugName) {
        console.error('Missing appointmentId or drugName in query parameters');
        return;
    }

    // Fetch Drug Order
    try {
        const response = await fetch(`/api/drugRequest/${appointmentId}/${drugName}`, {
            method: 'GET'
        });
        const drugOrder = await response.json();
        console.log("Drug Order: ", drugOrder);

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

    // Function to update contribute quantity based on inputs
    function updateContributeQuantity() {
        // Get values from inputs, defaulting to 0 if input is empty or NaN
        let inventoryQuantity = parseInt(inputInventory.value) || 0;
        let excessQuantity = parseInt(inputExcess.value) || 0;

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

        if (totalContribution === maxContribution) {
            try {
                // Update the drug request as completed
                const postResponse = await fetch(`/api/drugRequest/contribute/${appointmentId}/${drugName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ contributedQuantity: totalContribution })
                });

                const totalCost = parseFloat(document.getElementById('price').innerText.replace('$', ''));

                const putResponse = await fetch(`/api/drugRequest/drugContribution`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        appointmentId,
                        drugName,
                        quantity: totalContribution,
                        totalCost: parseFloat(totalContribution) * parseFloat(totalCost), // Replace drugPrice with actual value or calculation
                        contributeDate: getTodayDate(),
                        contributionStatus: 'Pending'
                    })
                });
    
                if (postResponse.ok && putResponse.ok) {
                    // Redirect to the company home page
                    window.location.href = 'companyHome.html';
                } else {
                    const errorData = await postResponse.json();
                    console.error('Failed to update drug request:', errorData.error || postResponse.statusText || putResponse.statusText);
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
    // Log properties to debug
    console.log("Order Properties:", order);

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
