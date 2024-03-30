const { readFile, writeFile } = require("fs");
const { db: dbConnection } = require("../configs/db");

require("dotenv").config();

const dbPath = process.env.dbPath;

const getAllBooks = async () => {
    const db = await dbConnection();
    return db.collection("books").find({}).toArray();
};
const deleteBook = async (bookId) => {
    if (!bookId) {
        return { message: "You should pass an Id", isOk: false, code: 400 };
    }

    let books = await getAllBooks();

    let bookIndex = books.findIndex((book) => book.id == bookId);

    if (bookIndex == -1) {
        return {
            message: "The book with the provided id could not be found",
            isOk: false,
            code: 400,
        };
    }

    const db = await dbConnection();
    const result = await db.collection("books").deleteOne({ id: Number(bookId) });

    if (result.deletedCount) {
        return { message: "Deleted :)", isOk: true, code: 200 };
    }
    return {
        message: "There was an error while deleting the book, please try again ...",
        isOk: false,
        code: 504,
    };
};

const addBook = async (bookData) => {
    let { name, price, author } = bookData;
    if (!name || (!price && price !== 0) || !author) {
        return { message: "Invalid inputs", isOk: false, code: 400 };
    }
    const db = await dbConnection();
    let lastBook = await db.collection("books").findOne({}, { sort: { createdAt: -1 } });

    let lastIndex = lastBook?.id;
    lastIndex = !lastIndex && lastIndex != 0 ? 0 : lastIndex;
    let newBook = {
        id: lastIndex + 1,
        name: name.toString(),
        price: price.toString(),
        author: author.toString(),
        isBooked: 0,
        createdAt: new Date(),
    };

    const result = await db.collection("books").insertOne(newBook);
    if (result.insertedId) {
        return {
            message: "The book has been added to the database successfully",
            isOk: true,
            code: 201,
        };
    }

    return {
        message: "An error occurred while adding the book to the database",
        isOk: false,
        code: 504,
    };
};

const editBook = (id, newData) => {
    let { name, price, author } = newData;
    return new Promise((resolve, reject) => {
        if (!name && !price && price !== 0 && !author) {
            reject({ message: "Invalid inputs" });
            return;
        }

        readFile(dbPath, (err, data) => {
            if (err) {
                reject({ message: "An error occurred while fetching data from the database" });
                return;
            }

            let db = JSON.parse(data);
            console.log(db);
            let index = db.books.findIndex((item) => item.id === id);

            if (index == -1) {
                reject({ message: "There is no such a book with the provided id" });
                return;
            }

            name = name ? name : db.books[index].name;
            price = price || price == 0 ? price : db.books[index].price;
            author = author ? author : db.books[index].author;

            db.books[index] = { ...db.books[index], name, price, author };

            writeFile(dbPath, JSON.stringify(db), (err) => {
                if (err) {
                    reject({ message: "An error occurred while editing the book" });
                    return;
                }
                resolve({ message: "The book has been edited successfully" });
            });
        });
    });
};

module.exports = {
    getAllBooks,
    deleteBook,
    addBook,
    editBook,
};
