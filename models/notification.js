const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Notification {
    constructor(notifId, accountId, message, readStatus){
        this.notificationId = notifId;
        this.accountId = accountId;
        this.message = message;
        this.readStatus = readStatus;
    }

    // Emmanuel
    static async getNotificatonByIds(id) {
        const connection = await sql.connect(dbConfig);


    }

    // Emmanuel

    // Emmanuel
    // Helper function get New NotificationId
    static async getNextNotificationId(dbConnection) {
        const query = `
        SELECT * 
        FROM Notification
        WHERE NotificationId =(SELECT max(NotificationId) FROM Notification);
    `;
        const request = dbConnection.request();
        const result = await request.query(query);

        if (result.recordset.length > 0) {
            const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
            return incrementString(result.recordset[0].NotificationId);
        } else {
            return "NOT0001" // return first new NotificationId
        }

    }

    // Emmanuel
    static async createNotification(senderId, recieverId, message) {
        const connection = await sql.connect(dbConfig);
        const newNotificationId = await Notification.getNextNotificationId(connection);
        const readStatus = 'Sent';

        const query = `
            INSERT INTO Notification (NotificationId, SenderId, ReceiverId, MessageValue) VALUES
            ('@NotificationId', '@SenderId', '@RecieverId', '@Message', '@ReadStatus');
        `;


        const request = connection.request();
        request.input('NotificationId', newNotificationId);
        request.input('SenderId', senderId);
        request.input('RecieverId', recieverId);
        request.input('Message', message);
        request.input('ReadStatus',readStatus)

        await request.query(query);
        connection.close();

        return new PaymentRequest(newNotificationId, senderId, recieverId, message, readStatus);
    }

    // Emmanuel
    static async getNotificationsByReceiverId(ReceiverId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT * 
            FROM Notification
            WHERE RecieverId = '@ReceiverId'
        `;

        const request = connection.request();
        request.input('ReceiverId', ReceiverId);

        await request.query(query);
        connection.close();

        return result.recordset.map(
            notification => new Notification(
                notification.notificationId,
                notification.accountId,
                notification.message,
                notification.readStatus)
        );
    }

    // Emmanuel
    static async updateNotification(notificationId, status) {
        const connection = await sql.connect(dbConfig);

        const query = `
            UPDATE Notification SET ReadStatus = '@Status'
            WHERE NotificationId =  '@notificationId'
        `;

        const request = connection.request();
        request.input('NotificationId', notificationId);
        request.input('ReadStatus', status);

        await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    // Emmanuel
    static async updateManyNotifications(status) {
        const connection = await sql.connect(dbConfig);

    }
}

module.exports = Notification;