document.addEventListener('DOMContentLoaded', async function () {
    // Verify User Logged In
    
    const accountId = sessionStorage.getItem("accountId");
    if (!accountId) window.location.href = "../login.html";


    // Fetch Patient's Profile
    const fetchPatientDetails = await fetch (`/api/patient/${accountId}`, {
        method: 'GET'
    })

    // Fetch Patient's notifications
    const fetchNotifications = await fetch(`/api/notifications/${accountId}`, {
        method: 'GET'
    });

    // fill in patient's name
    const patientDetailsJson = await fetchPatientDetails.json();
    console.log(patientDetailsJson);
    document.getElementById("accountName").innerText = patientDetailsJson.patient.senderName;


    // populate notifications
    const notificationsJson = await fetchNotifications.json();
    const notifications = notificationsJson.notifications;
    console.log(notificationsJson);
    console.log(notifications);

    console.log("the script runs")
    if (notifications && notifications.length > 0) {
        for (const notification of notifications) {
            console.log(notification);
            let notificationId = notification.NotificationId;
            console.log(notificationId);

            document.getElementById("notificationList").innerHTML += `
            <div style="border: 1px solid #e5e7eb;">
                <div style="padding: 1rem;">
                    <h2 style="font-size: 1.25rem; font-weight: bold;">${notification.SenderName}</h2>
                </div>
                <div style="padding: 1rem;">
                    <p style="color: #4b5563;">${notification.MessageValue}</p>
                </div>
                <div style="padding: 1rem;">
                    <p style="font-size: 0.875rem; color: #9ca3af;" id="${notificationId}">Read</p>
                </div>
            </div>
            `;
        }

    } else {
        document.getElementById("notificationList").innerHTML = `
        <div style="padding: 1rem;">
            <h2 style="font-size: 1.25rem; font-weight: bold;">No notifications to read</h2>
        </div>`
    }

});