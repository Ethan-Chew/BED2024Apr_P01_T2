document.addEventListener('DOMContentLoaded', async function () {
    // Verify User Logged In
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) window.location.href = "../login.html";

    // Fetch Patient's notifications
    const fetchNotifications = await fetch(`/api/notifications`, {
        method: 'GET'
    });

    const notificationsJson = await fetchNotifications.json();
    let notifications = notificationsJson.notifications;
    console.log(notifications);

    if (notifications.length > 0) {
        for (const notification of notifications) {
            console.log(notification);

            document.getElementById("paymentRequests").innerHTML += `
            <div style="border: 1px solid #e5e7eb;">
                <div style="padding: 1rem;">
                    <h2 style="font-size: 1.25rem; font-weight: bold;">${notification.receiverName}</h2>
                </div>
                <div style="padding: 1rem;">
                    <p style="color: #4b5563;">Your lab results are in. Please schedule a follow-up appointment to discuss.</p>
                </div>
                <div style="padding: 1rem;">
                    <p style="font-size: 0.875rem; color: #9ca3af;">Oct 15, 9:32 AM</p>
                </div>
            </div>
            `;
        }

    }

});