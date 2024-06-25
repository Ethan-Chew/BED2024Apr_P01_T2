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
})