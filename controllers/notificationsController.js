const notification = require("../models/notifications");

// Emmanuel
const sendNotification = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    /*
    if (req.user.id !== senderId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to send a notification using this account."
        });
        return;
    }
    */

    try {
        const createNotification = await notification.createNotification(senderId, receiverId, message);

        if (!createNotification) {
            res.status(500).json({
                message: `Failed to create and send Notification.`
            });
            return;
        }
        res.status(201).json({
            message: `Notification with ID ${createNotification.notificationId} has been created.`,
            notification: createNotification
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Emmanuel
const receiveNotifications = async (req, res) => {
    const accountId  = req.params.accountId;

    if (!accountId || typeof accountId !== 'string') {
        console.log("jdsiofkjdlkfjd;lasfs")
        return res.status(400).json({ message: 'Invalid account ID' });
    }


    if (req.user.id !== accountId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to receive these notifications using this account."
        });
        return;
    }


    try {
        const status = 'Received';
        const getNotifications = await notification.getNotificationsByReceiverId(accountId);

        if (!getNotifications) {
            res.status(404).json({
                message: `Failed to get any notifications, notifications do not exist for this user`
            });
            return;
        }

        const updateNotifications = await notification.updateManyNotificationsByReceiverId(accountId, status);
        console.log(updateNotifications);
        if (!updateNotifications) {
            res.status(404).json({
                message: `Failed to update the notifications as received`
            });
            return;
        }

        res.status(201).json({
            message: `Notifications succesfully returned`,
            notifications: getNotifications
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Emmanuel
const readNotification = async (req, res) => {
    const { notificationId } = req.params;
    const status = 'Read';
    if (!notificationId || typeof notificationId !== 'string') {
        return res.status(400).json({ message: 'Invalid notification ID' });
    }

    if (req.user.id !== senderId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to read this notification using this account."
        });
        return;
    }
    a

    try {
        const updateNotification = await notification.readNotification(notificationId);

        if (!updateNotification) {
            res.status(500).json({
                message: `Failed to update Notification as Read`
            });
            return;
        }

        res.status(202).json({
            message: `Notification successfully updated as read`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Emmanuel
const readAllNotificationsByAccountId = async (req, res) => {
    const { accountId } = req.user.id;

    if (!notificationId || typeof notificationId !== 'string') {
        return res.status(400).json({ message: 'Invalid account ID' });
    }

    /*
    if (req.user.id !== senderId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to read this notification using this account."
        });
        return;
    }
    */

    try {
        const updateNotifications = await notification.readAllNotificationsByAccountId(accountId);

        if (!updateNotifications) {
            res.status(500).json({
                message: `Failed to update Notifications as Read`
            });
            return;
        }

        res.status(202).json({
            message: `Notifications successfully updated as read`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

module.exports = {
    sendNotification,
    readNotification,
    receiveNotifications,
    readAllNotificationsByAccountId,
}

