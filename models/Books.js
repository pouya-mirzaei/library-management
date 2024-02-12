const { readFile, writeFile } = require("fs");

const dbPath = "./db.json";

const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        readFile("./db.json", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data).books);
        });
    });
};
const deleteBook = (bookId) => {
    return new Promise((resolve, reject) => {
        if (!bookId) {
            reject({ message: "You should pass an Id" });
            return;
        }
        readFile(dbPath, (err, data) => {
            console.log("here");
            if (err) {
                reject(err);
            }
            data = JSON.parse(data);
            let { books } = data;

            let filteredBooks = books.filter((book) => book.id != bookId);

            if (books.length === filteredBooks.length) {
                reject({ message: "The book with the provided id could not be found" });
                return;
            }
            writeFile(dbPath, JSON.stringify({ ...data, books: filteredBooks }), (err) => {
                if (err) {
                    reject({
                        message: "There was an error while deleting the book :( try again",
                    });
                    return;
                }
                resolve({ message: "Deleted :)" });
            });
        });
    });
};

const addBook = (bookData) => {
    let { name, price, author } = bookData;
    return new Promise((resolve, reject) => {
        if (!name || (!price && price !== 0) || !author) {
            reject({ message: "Invalid inputs" });
            return;
        }
        let newBook = {
            id: crypto.randomUUID(),
            name: name.toString(),
            price: price.toString(),
            author: author.toString(),
            isBooked: 0,
        };
        readFile(dbPath, (err, data) => {
            if (err) {
                reject({ message: "An error occurred while fetching data from the database" });
                return;
            }
            let newData = JSON.parse(data);
            if (!newData.books) newData.books = [];
            newData.books.push(newBook);
            writeFile(dbPath, JSON.stringify(newData), (err) => {
                if (err) {
                    reject({ message: "An error occurred while adding the book to the database" });
                    return;
                }
                resolve({ message: "The book has been added to the database successfully" });
            });
        });
    });
};

module.exports = {
    getAllBooks,
    deleteBook,
    addBook,
};
