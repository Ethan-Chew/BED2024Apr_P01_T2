document.addEventListener('DOMContentLoaded', async function () {
    // Verify User Logged In
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) window.location.href = "../login.html";
    
    // Get Patient's Wallet
    const digitalWalletRequest = await fetch(`/api/patient/${accountId}/digitalWallet`);
    if (digitalWalletRequest.status === 404) {
        document.getElementById("no-wallet-container").classList.remove("hidden");
        document.getElementById("wallet-container").classList.add("hidden");
        
        document.getElementById("create-wallet").addEventListener("click", async function () {
            const createWalletRequest = await fetch(`/api/patient/${accountId}/digitalWallet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ balance: 0 }),
            });
            if (createWalletRequest.status === 201) {
                alert("Digital Wallet created successfully");
                window.location.reload();
                document.getElementById("no-wallet-container").classList.add("hidden");
            } else {
                alert("Failed to create wallet. Please try again later.");
            }
        });
    } else if (digitalWalletRequest.status === 401 || digitalWalletRequest.status === 403) {
        window.location.href = "../login.html";
    } else {
        document.getElementById("no-wallet-container").classList.add("hidden");
        document.getElementById("wallet-container").classList.remove("hidden");
    }
    
    const digitalWalletJson = await digitalWalletRequest.json();
    const digitalWallet = digitalWalletJson.wallet;

    // Update Data on Screen
    document.getElementById("wallet-balance").innerText = digitalWallet.balance.toLocaleString();

    // Update Transaction History
    if (digitalWallet.transactionHistory.length === 0) {
        document.getElementById("transaction-history-container").innerHTML += `
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <p>No Recent Transactions</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    for (let i = 0; i < digitalWallet.transactionHistory.length; i++) {
        const transaction = digitalWallet.transactionHistory[i];
        document.getElementById("transaction-history-container").innerHTML += `
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <p style="font-weight: bold;">${transaction.title}</p>
                        <p class="text-muted-foreground">${new Date(Number(transaction.date)).toLocaleDateString("en-US")}</p>
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

    // Handle when User Adds Money to Wallet
    document.getElementById("add-funds").addEventListener("click", async function () {
        document.getElementById("addfunds-popup").classList.remove("hidden");

        document.getElementById("addfunds-form").addEventListener("submit", async function (e) {
            e.preventDefault();

            const amount = parseFloat(document.getElementById("addfunds-amount").value);
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount to add to your wallet");
                return;
            }

            // Update Wallet with New Amount
            const updateWalletRequest = await fetch(`/api/patient/${accountId}/digitalWallet`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updateAmount: amount }),
            });

            if (updateWalletRequest.status !== 200) {
                alert("Failed to add funds to wallet. Please try again later.");
                return;
            }

            // Add Transaction History
            const updateWalletHistoryRequest = await fetch(`/api/patient/${accountId}/digitalWalletHistory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Online Topup", amount: amount }),
            });

            if (updateWalletHistoryRequest.status !== 201) {
                alert("Failed to add funds to wallet. Please try again later.");
                return;
            }

            alert("Funds added successfully");
            document.getElementById("addfunds-popup").classList.add("hidden");
            window.location.reload();
        });
    });
});