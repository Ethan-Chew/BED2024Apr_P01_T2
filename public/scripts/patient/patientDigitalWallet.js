document.addEventListener('DOMContentLoaded', async function () {
    // Verify User Logged In
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) window.location.href = "../login.html";
    
    // Get Patient's Wallet
    const digitalWalletRequest = await fetch(`/api/patient/${accountId}/digitalWallet`);
    if (digitalWalletRequest.status === 404) {
        document.getElementById("no-wallet-container").classList.remove("hidden");
        document.getElementById("wallet-container").classList.add("hidden");
    } else if (digitalWalletRequest.status === 401 || digitalWalletRequest.status === 403) {
        window.location.href = "../login.html";
    }
    const digitalWalletJson = await digitalWalletRequest.json();
    const digitalWallet = digitalWalletJson.wallet;

    // Update Data on Screen
});