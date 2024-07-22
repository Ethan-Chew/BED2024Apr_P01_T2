document.addEventListener('DOMContentLoaded', async () => {
    // Handle Logout Button Press
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('accountId');
        window.location.href = '../index.html';
    });

    document.getElementById("btn-home").addEventListener('click', () => {
        window.location.href = './companyHome.html';
    })

    // Get Company Information
    const companyId = sessionStorage.getItem('accountId');

    // Get Confirmed Drug Contribution Orders
    const fetchConfirmedDrugContributionOrders = await fetch(`/api/drugContributionOrders/${companyId}`, {
        method: 'GET'
    });
    const confirmedDrugContributionOrders = await fetchConfirmedDrugContributionOrders.json();

    const confirmedContributionList = document.getElementById('confirmed-contribution-list-body');
    const nextPageButton = document.getElementById('next-page-button');
    const pageNumberInput = document.getElementById('page-number-input');
    const totalPagesSpan = document.getElementById('total-pages-span');

    let currentPage = 1;
    let itemsPerPage = 10;
    let totalItems = confirmedDrugContributionOrders.length;
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    

    // Function to render confirmed contribution orders
    const renderConfirmedContributionOrders = (orders, startIndex, endIndex) => {
        confirmedContributionList.innerHTML = '';
        for (let i = startIndex; i < endIndex && i < orders.length; i++) {
            const order = orders[i];
            const confirmedContributionItem = document.createElement('tr');
            confirmedContributionItem.innerHTML = `
                <td style="padding: 8px; border: 1px solid #EAEAEA;">${order.appointmentId}</td>
                <td style="padding: 8px; border: 1px solid #EAEAEA;">${formatDate(order.contributeDate)}</td>
                <td style="padding: 8px; border: 1px solid #EAEAEA;">${order.drugName}</td>
                <td style="padding: 8px; border: 1px solid #EAEAEA;">${order.drugQuantity}</td>
            `;
            confirmedContributionList.appendChild(confirmedContributionItem);
        }
    };

    const updateLoadMoreButton = () => {
        if (itemsPerPage < totalItems && currentPage < totalPages) {
            nextPageButton.style.display = 'block';
        } else {
            nextPageButton.style.display = 'none';
        }
    };

    // Filter confirmed orders
    const confirmedOrders = confirmedDrugContributionOrders.filter((order) => order.contributionStatus === 'Completed');

    // Initial render
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    renderConfirmedContributionOrders(confirmedOrders, startIndex, endIndex);
    updateLoadMoreButton();

    // Add event listener to load more button
    nextPageButton.addEventListener('click', () => {
        currentPage++;
        itemsPerPage = 10;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        renderConfirmedContributionOrders(confirmedOrders, startIndex, endIndex);
        updateLoadMoreButton();
        pageNumberInput.value = currentPage;
    });

    // Add event listener to pagination input
    pageNumberInput.addEventListener('input', () => {
        const pageNumber = parseInt(pageNumberInput.value);
        if (pageNumber > totalPages) {
            pageNumberInput.value = totalPages;
        } else if (pageNumber < 1) {
            pageNumberInput.value = 1;
        } else {
            currentPage = pageNumber;
            itemsPerPage = 10;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            renderConfirmedContributionOrders(confirmedOrders, startIndex, endIndex);
            updateLoadMoreButton();
        }
    });

    // Add event listener to go button
    document.getElementById('go-button').addEventListener('click', () => {
        const pageNumber = parseInt(pageNumberInput.value);
        if (pageNumber > totalPages) {
            pageNumberInput.value = totalPages;
        } else if (pageNumber < 1) {
            pageNumberInput.value = 1;
        } else {
            currentPage = pageNumber;
            itemsPerPage = 10;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            renderConfirmedContributionOrders(confirmedOrders, startIndex, endIndex);
            updateLoadMoreButton();
        }
    });

    // Update total pages span
    totalPagesSpan.innerHTML = `of ${totalPages}`;

    // Add event listener to export to csv button
    document.getElementById('export-to-csv').addEventListener('click', () => {
        const csvContent = [];
      
        // Get the header row
        const headers = ['Appointment ID', 'Contribute Date', 'Drug Name', 'Drug Quantity', 'Contribution Status'];
        csvContent.push(headers.join(','));
      
        // Get the data rows
        confirmedDrugContributionOrders.forEach((order) => {
          const data = [
            order.appointmentId,
            formatDate(order.contributeDate),
            order.drugName,
            order.drugQuantity,
            order.contributionStatus,
          ];
          csvContent.push(data.join(','));
        });
      
        // Create a blob with the CSV content
        const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
      
        // Create a link to download the CSV file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'confirmed_contributions.csv';
        link.click();
    });

});

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }); // Get the month as full name
    const year = date.getFullYear(); // Get the full year
    return `${day} ${month} ${year}`;
}