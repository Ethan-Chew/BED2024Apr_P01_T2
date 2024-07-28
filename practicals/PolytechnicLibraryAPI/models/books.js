const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book {
    constructor(id, title, author, availability) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.availability = availability;
    }

    static async getAllBooks() {
        const connection = await sql.connect(dbConfig);

        const query = `SELECT * FROM Books`;
        const request = connection.request();
        const result = await request.query(query);

        connection.close();

        return result.recordset.map(record => new Book(record.id, record.title, record.author, record.availability));
    }

    static async getBookById(bookId) {
        const connection = await sql.connect(dbConfig);

        const query = `SELECT * FROM Books WHERE id = @bookId`;
        const request = connection.request();
        request.input("bookId", bookId);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length === 0) return null;

        const record = result.recordset[0];
        return new Book(record.id, record.title, record.author, record.availability);
    }

    static async updateBookAvailability(bookId, availability) {
        const connection = await sql.connect(dbConfig);

        const query = `UPDATE Books SET availability = @availability WHERE id = @bookId`;
        const request = connection.request();
        request.input("bookId", bookId);
        request.input("availability", availability);

        await request.query(query);
        connection.close();
        
        return this.getBookById(bookId);
    }
}

module.exports = Book;