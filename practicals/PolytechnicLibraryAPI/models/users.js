const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
    constructor(id, username, password, role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    static async createUser(user) {
        const connection = await sql.connect(dbConfig);
    
        // Define the SQL query with placeholders
        const sqlQuery = `INSERT INTO Users (username, passwordHash, role)
                            VALUES (@username, @passwordHash, @role);`;
    
        // Prepare the request object
        const request = connection.request();
    
        // Add parameters to the request
        request.input('username', user.username);
        request.input('passwordHash', user.hashedPassword);
        request.input('role', user.role);
    
        try {
            // Execute the query
            const result = await request.query(sqlQuery);
            console.log("User created successfully");
            return new User(result.insertId, user.username, user.hashedPassword, user.role);
        } catch (error) {
            console.error("Error creating user:", error);
            throw error; // Rethrow the error to handle it in the caller function
        } finally {
            // Close the database connection
            connection.close();
        }
    }

    static async getUserByUsername(username) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Users 
                            WHERE username = @username`; // Parameterized query
    
        const request = connection.request();
        request.input("username", username);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset[0]
          ? new User(
              result.recordset[0].user_id,
              result.recordset[0].username,
              result.recordset[0].email,
              result.recordset[0].role,
            )
          : null; // Handle book not found
    }
}

module.exports = User;