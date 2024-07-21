const notification = require("../models/notification");

// Emmanuel
const sendNotification = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    if (req.user.id !== senderId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to send a notification using this account."
        });
        return;
    }

    try {
        const createNotification = await notification.createNotification(senderId, receiverId, message);

        if (!createNotification) {
            res.status(500).json({
                message: `Failed to create and send Notification.`
            });
            return;
        }
        res.status(201).json({
            message: `Notification with ID ${notificationId} has been created.`,
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

const receiveNotifications = async (req,res) => {
    const { accountId } = req.params;

    if (!accountId || typeof accountId!== 'string') {
        return res.status(400).json({ message: 'Invalid account ID' });
    }
    
    if (req.user.id !== senderId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to receive these notifications using this account."
        });
        return;
    }

    try {
        const getNotifications = await notification.getNotificationsByReceiverId(accountId)
        for (i=0; i < getNotifications.length; i++) {
            
        }

        if (!getNotifications) {
            res.status(500).json({
                message: `Failed to get any notifications`
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

const readNotification = async (req, res) =>  {
    const { notificationId } = req.params;
    const status = 'Read';
    if (!notificationId || typeof notificationId!== 'string') {
        return res.status(400).json({ message: 'Invalid notification ID' });
    }

    if (req.user.id !== senderId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to read this notification using this account."
        });
        return;
    }


    try {
        const updateNotification = await notification.updateNotification(notificationId, status);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}
