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
});

function populateDrugOrderInfo(order) {
    // Log properties to debug
    console.log("Order Properties:", order);

    document.getElementById("inventory-quantity").innerHTML = order.drugAvailabilityQuantity;
    document.getElementById("price").innerHTML = '$' + (order.drugPrice * order.drugAvailabilityQuantity).toFixed(2);
    document.getElementById("request-quantity").innerHTML = order.drugQuantity;
    document.getElementById("appointment-id").innerHTML = order.appointmentId;
}

