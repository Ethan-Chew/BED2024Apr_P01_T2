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
    document.getElementById("wallet-balance").innerText = digitalWallet.balance.toFixed(2);

    // Update Transaction History
    for (let i = 0; i < digitalWallet.transactionHistory.length; i++) {
        const transaction = digitalWallet.transactionHistory[i];
        document.getElementById("transaction-history-container").innerHTML += `
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <p style="font-weight: bold;">${transaction.title}</p>
                        <p class="text-muted-foreground">${new Date(transaction.date * 1000).toLocaleDateString("en-US")}</p>
                    </div>
                    <div class="${transaction.amount > 0 ? "text-accent" : "text-destructive"}">${transaction.amount > 0 ? "+" : ""} ${transaction.amount} $</div>
                </div>
            </div>
        `;
    }

    // Handle when User Deletes the Wallet
    document.getElementById("delete-wallet").addEventListener("click", async function () {
        const confirmDelete = confirm("Are you sure you want to delete your wallet? All money attached to it will be lost FOREVER.");
        if (!confirmDelete) return;

        // Delete Wallet History
        await fetch(`/api/patient/${accountId}/digitalWalletHistory`, {
            method: "DELETE"
        });

        // Delete Actual Wallet
        const deleteWalletRequest = await fetch(`/api/patient/${accountId}/digitalWallet`, {
            method: "DELETE"
        });
        if (deleteWalletRequest.status === 200) {
            alert("Digital Wallet deleted successfully");
            window.location.reload();
        } else {
            alert("Failed to delete wallet. Please try again later.");
        }
    });
});