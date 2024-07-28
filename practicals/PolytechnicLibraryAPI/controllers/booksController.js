const Book = require("../models/books");

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving books");
    }
};

const updateBookAvailability = async (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const availability = req.params.availability;

    try {
        const updatedBook = await Book.updateBookAvailability(bookId,availability);
        if (!updatedBook) return res.status(404).send("Book not found");
        res.status(200).json({ message: "Book availability updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update book availability");
    }
};

module.exports = {
    getAllBooks,
    updateBookAvailability
}