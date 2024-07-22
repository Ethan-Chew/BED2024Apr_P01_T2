const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Notifications {
    constructor(notifId, senderId, receiverId, message, readStatus) {
        this.notificationId = notifId;
        this.senderId = senderId;
        this.receiverId = receiverId;
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
    static async createNotification(senderId, receiverId, message) {
        const connection = await sql.connect(dbConfig);
        const newNotificationId = await Notifications.getNextNotificationId(connection);
        const readStatus = 'Sent';

        const query = `
            INSERT INTO Notification (NotificationId, SenderId, ReceiverId, MessageValue, ReadStatus) VALUES
            (@NotificationId, @SenderId, @ReceiverId, @Message, @ReadStatus);
        `;


        const request = connection.request();
        request.input('NotificationId', newNotificationId);
        request.input('SenderId', senderId);
        request.input('ReceiverId', receiverId);
        request.input('Message', message);
        request.input('ReadStatus', readStatus)

        // console.log(newNotificationId, senderId, receiverId, message, readStatus);
        await request.query(query);
        connection.close();

        return new Notifications(newNotificationId, senderId, receiverId, message, readStatus);
    }

    // Emmanuel
    static async getNotificationsByReceiverId(receiverId) {
        const connection = await sql.connect(dbConfig);
        const status = 'Read';

        const query = `
            SELECT n.* ,  a.AccountName AS 'SenderName'
            FROM Notification n
            INNER JOIN account a ON n.senderId = a.AccountId
            WHERE ReceiverId = '@ReceiverId' AND ReadStatus != @Status
        `;

        const request = connection.request();
        request.input('ReceiverId', receiverId);
        request.input('ReadStatus', status);

        await request.query(query);
        connection.close();

        return result.recordset.map();
    }

    // Emmanuel
    static async readNotification(notificationId) {
        const connection = await sql.connect(dbConfig);
        const status = 'Read';

        const query = `
            UPDATE Notification SET ReadStatus = @Status
            WHERE NotificationId =  @notificationId
        `;

        const request = connection.request();
        request.input('NotificationId', notificationId);
        request.input('ReadStatus', status);

        await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    // Emmanuel
    static async updateManyNotificationsByReceiverId(receiverId, status) {
        const connection = await sql.connect(dbConfig);

        const query = `
            UPDATE Notification SET ReadStatus = @Status
            WHERE RecieverId =  @ReceiverId
        `;

        const request = connection.request();
        request.input('ReceiverId', receiverId);
        request.input('Status', status)

        await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }
}

module.exports = Notifications;