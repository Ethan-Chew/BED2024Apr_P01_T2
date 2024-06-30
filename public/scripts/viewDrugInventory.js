document.addEventListener('DOMContentLoaded', function() {
    async function fetchDrugData() {
        const response = await fetch('/api/drugInventory');
        return await response.json();
    }

    function displayDrugInfo(drug) {
        // Create the main container for the drug information
        const drugInfoDiv = document.createElement('div');
        drugInfoDiv.className = "min-w-max bg-gray-200 rounded-lg p-4";
    
        // Drug name section
        const nameSection = document.createElement('div');
        nameSection.className = "mb-4";
        const drugName = document.createElement('h2');
        drugName.className = "text-2xl font-bold";
        drugName.textContent = drug.name;
        nameSection.appendChild(drugName);
        drugInfoDiv.appendChild(nameSection);
    
        // Drug image and details section
        const detailsSection = document.createElement('div');
        detailsSection.className = "mb-4";
        const drugImage = document.createElement('div');
        drugImage.className = "bg-gray-300 h-32 w-32 mb-4";
        detailsSection.appendChild(drugImage);
    
        // Grid for drug info and quantity
        const grid = document.createElement('div');
        grid.className = "grid grid-cols-2 gap-4";
    
        // Drug info column
        const drugInfoColumn = document.createElement('div');
        const drugInfoTitle = document.createElement('h3');
        drugInfoTitle.className = "font-bold";
        drugInfoTitle.textContent = "Expiry Date";
        drugInfoColumn.className = "pr-25";
        drugInfoColumn.appendChild(drugInfoTitle);

        drugInfoColumn.innerHTML += `<p>${drug.expiryDate}</p>`;
        grid.appendChild(drugInfoColumn);
    
        // Quantity and price column
        const quantityColumn = document.createElement('div');
        quantityColumn.innerHTML = `<h3 class="font-bold">Quantity</h3><p>${drug.availableQuantity}</p><h3 class="font-bold mt-4">Price/Unit</h3><p>$${drug.price}</p>`;
        grid.appendChild(quantityColumn);
    
        detailsSection.appendChild(grid);
        drugInfoDiv.appendChild(detailsSection);
    
        // Medication info section
        const medicationInfoSection = document.createElement('div');
        medicationInfoSection.className = "mt-4";
        const medicationInfoTitle = document.createElement('h3');
        medicationInfoTitle.className = "font-bold";
        medicationInfoTitle.textContent = "Medication Info";
        medicationInfoSection.appendChild(medicationInfoTitle);
        medicationInfoSection.innerHTML += `<p>${drug.description}</p>`;
        detailsSection.appendChild(medicationInfoSection);
    
        // Request more button
        const requestMoreSection = document.createElement('div');
        requestMoreSection.className = "text-right";
        const requestMoreButton = document.createElement('button');
        requestMoreButton.className = "p-3 bg-white rounded-lg shadow hover:bg-gray-300";
        requestMoreButton.textContent = "Request for more";
        requestMoreSection.appendChild(requestMoreButton);
    
        drugInfoDiv.appendChild(requestMoreSection);

        document.getElementById('drugInfoPanel').innerHTML = "";
        document.getElementById('drugInfoPanel').appendChild(drugInfoDiv); 
    }

    function createDrugElement(drug) {
        const drugDiv = document.createElement('div');
        const button = document.createElement('button');
        button.textContent = drug.name;
        button.addEventListener('click', () => displayDrugInfo(drug));

        drugDiv.appendChild(button);

        return drugDiv;
    }

    async function displayDrugs(searchTerm = '') {
        const drug = await fetchDrugData();
        const container = document.getElementById('drugPanel');
        container.innerHTML = '';
    
        const filteredDrugs = drug.inventory.filter(drug => 
            drug.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        filteredDrugs.forEach(drug => {
            const drugElement = createDrugElement(drug);
            container.appendChild(drugElement);
        });
    }

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        displayDrugs(searchTerm);
    });

    displayDrugs();
});