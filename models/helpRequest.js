const sql = require("mssql");
const dbConfig = require("../dbConfig");

class PaymentRequest {
    constructor(PaymentRequestId, AppointmentId, PaymentRequestMessage, PaymentRequestCreated, PaymentRequestStatus) {
      this.PaymentRequestId = PaymentRequestId;
      this.AppointmentId = AppointmentId;
      this.PaymentRequestMessage = PaymentRequestMessage;
      this.PaymentRequestCreated = PaymentRequestCreated;
      this.PaymentRequestStatus = PaymentRequestStatus;
    }
  
    static async getPendingRequests() {
      const connection = await sql.connect(dbConfig);
  
      const query = `
          SELECT * FROM PaymentRequest
          WHERE PaymentRequestStatus = 'Pending'
      `;
  
      const request = connection.request();
      const result = await request.query(query);
      connection.close();
  
      if (result.recordset.length == 0) return null;
  
      return result.recordset.map(row =>
        new PaymentRequest(
          row.PaymentRequestId,
          row.AppointmentId,
          row.PaymentRequestMessage,
          row.PaymentRequestCreated,
          row.PaymentRequestStatus
        )
      );
    }

    static async approveRequest(requestId) {
        const connection = await sql.connect(dbConfig);
    
        const query = `
            UPDATE PaymentRequest SET
            PaymentRequestStatus = 'Approved'
            WHERE PaymentRequestId = @requestId
        `;
    
        const request = connection.request();
    
        request.input('requestId', requestId);
        await request.query(query);
    
        connection.close();
    
        return { requestId };
    }

    static async rejectRequest(requestId) {
        const connection = await sql.connect(dbConfig);
    
        const query = `
            UPDATE PaymentRequest SET
            PaymentRequestStatus = 'Rejected'
            WHERE PaymentRequestId = @requestId
        `;
    
        const request = connection.request();
    
        request.input('requestId', requestId);
        await request.query(query);
    
        connection.close();
    
        return { requestId };
    }

  }
  
  module.exports = PaymentRequest;