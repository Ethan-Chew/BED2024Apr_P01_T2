// book.test.js
const Book = require("../models/books");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

describe("Book.updateBookAvailability", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update the availability of a book", async () => {
      const mockUpdatedBook = {
        id: 1,
        title: "The Lord of the Rings",
        author: "Ethan Chew",
        availability: "N",
      }

        const mockRequest = {
            query: jest.fn().mockResolvedValue({ rowsAffected: 1 }),
            input: jest.fn(),
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection);
        Book.getBookById = jest.fn().mockResolvedValue(mockUpdatedBook);

        const updatedBook = await Book.updateBookAvailability(1, "Y");

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("bookId", 1);
        expect(mockRequest.input).toHaveBeenCalledWith("availability", "Y");
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(updatedBook).toEqual(new Book(1, "The Lord of the Rings", "Ethan Chew", "N"));
    });
  
    it("should return null if book with the given id does not exist", async () => {
        const mockRequest = {
            query: jest.fn().mockResolvedValue({ rowsAffected: 0 }),
            input: jest.fn(),
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection);
        Book.getBookById = jest.fn().mockResolvedValue(null);

        const updatedBook = await Book.updateBookAvailability(2, "Y");

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(updatedBook).toBeNull();
    });
});