const { readFile, writeFile } = require("fs");
const { db: dbConnection } = require("../configs/db");
const { ObjectId } = require("bson");

require("dotenv").config();

const dbPath = process.env.dbPath;

const getAllBooks = async () => {
    const db = await dbConnection();
    return db.collection("books").find({}).toArray();
};
const deleteBook = async (bookId) => {
    if (!bookId) {
        return { message: "You should pass an Id", ok: false, code: 400 };
    }

    let books = await getAllBooks();

    let bookIndex = books.findIndex((book) => book.id == bookId);

    if (bookIndex == -1) {
        return {
            message: "The book with the provided id could not be found",
            ok: false,
            code: 400,
        };
    }

    const db = await dbConnection();
    const result = await db.collection("books").deleteOne({ id: Number(bookId) });

    if (result.deletedCount) {
        return { message: "Deleted :)", ok: true, code: 200 };
    }
    return {
        message: "There was an error while deleting the book, please try again ...",
        ok: false,
        code: 504,
    };
};

const addBook = async (bookData) => {
    let { name, price, author } = bookData;
    if (!name || (!price && price !== 0) || !author) {
        return { message: "Invalid inputs", ok: false, code: 400 };
    }
    const db = await dbConnection();
    let lastBook = await db.collection("books").findOne({}, { sort: { createdAt: -1 } });

    let lastIndex = lastBook?.id;
    lastIndex = !lastIndex && lastIndex != 0 ? 0 : lastIndex;
    let newBook = {
        id: lastIndex + 1,
        name: name.toString(),
        price,
        author: author.toString(),
        isBooked: 0,
        createdAt: new Date(),
    };

    const result = await db.collection("books").insertOne(newBook);
    if (result.insertedId) {
        return {
            message: "The book has been added to the database successfully",
            ok: true,
            code: 201,
        };
    }

    return {
        message: "An error occurred while adding the book to the database",
        ok: false,
        code: 504,
    };
};

const editBook = async (id, newData) => {
    let { name, price, author } = newData;

    if (!name && !price && price !== 0 && !author) {
        return { message: "Invalid inputs", code: 400, ok: false };
    }

    const db = await dbConnection();
    const bookCollection = db.collection("books");

    let book = await bookCollection.findOne({ id: Number(id) });

    if (!book) {
        return { message: "There is no such a book with the provided id", code: 404, ok: false };
    }

    name = name ? name : book.name;
    price = price || price == 0 ? price : book.price;
    author = author ? author : book.author;

    book = { ...book, name, price, author };

    const result = await bookCollection.updateOne(
        { _id: new ObjectId(book._id) },
        { $set: { ...book, updatedAt: new Date() } }
    );

    if (result.modifiedCount) {
        return { message: "The book has been edited successfully", code: 202, ok: true };
    }

    return { message: "An error occurred while editing the book", code: 504, ok: false };
};

module.exports = {
    getAllBooks,
    deleteBook,
    addBook,
    editBook,
};
