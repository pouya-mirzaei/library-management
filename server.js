const http = require("http");
const { readFile, writeFile } = require("fs");

const dbPath = "./db.json";

const server = http.createServer((req, res) => {
    let { url: reqUrl, method } = req;
    let fullUrl = new URL(reqUrl, "http://localhost:3001");
    let { pathname } = fullUrl;

    if (method === "GET" && reqUrl === "/api/books") {
        readFile(dbPath, (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);
            res.writeHead(200, { "Content-type": "application/json" });
            res.write(JSON.stringify(data.books));
            res.end();
        });
    } else if (method === "GET" && reqUrl === "/api/users") {
        readFile(dbPath, (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);
            res.writeHead(200, { "Content-type": "application/json" });
            res.write(JSON.stringify(data.users));
            res.end();
        });
    } else if (method === "DELETE" && pathname === "/api/books") {
        deleteBook(fullUrl.searchParams.get("id"))
            .then((response) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(response));
                res.end();
            })
            .catch((err) => {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.write(JSON.stringify(err));
                res.end();
            });
    } else if (method === "POST" && reqUrl === "/api/books") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            if (!body) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "give me some data bitch" }));
                return;
            }
            let data = JSON.parse(body);
            addBook(data)
                .then((respond) => {
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.write(JSON.stringify(respond));
                    res.end();
                })
                .catch((err) => {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.write(JSON.stringify(err));
                    res.end();
                });
        });
    } else if (method === "PUT" && pathname === "/api/books") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            if (!body) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "give me some data bitch" }));
                return;
            }
            let data = JSON.parse(body);
            let id = fullUrl.searchParams.get("id");
            editBook(id, data)
                .then((response) => {
                    res.writeHead(202, { "Content-Type": "application/json" });
                    res.write(JSON.stringify(response));
                    res.end();
                })
                .catch((err) => {
                    res.writeHead(504, { "Content-Type": "application/json" });
                    res.write(JSON.stringify(err));
                    res.end();
                });
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "This api does not exists :(" }));
        res.end();
    }
});

server.listen(3001, () => {
    console.log("Server is running on port 3001 ...");
});

function deleteBook(bookId) {
    return new Promise((resolve, reject) => {
        if (!bookId) reject({ message: "You should pass an Id" });

        readFile(dbPath, (err, data) => {
            if (err) {
                reject(err);
            }
            data = JSON.parse(data);
            let { books } = data;

            let filteredBooks = books.filter((book) => book.id != bookId);

            if (books.length === filteredBooks.length) {
                return new Promise((res, rej) => {
                    reject({ message: "The book with the provided id could not be found" });
                });
            }
            writeFile(dbPath, JSON.stringify({ ...data, books: filteredBooks }), (err) => {
                return new Promise((res, rej) => {
                    if (err)
                        reject({
                            message: "There was an error while deleting the book :( try again",
                        });
                    resolve({ message: "Deleted :)" });
                });
            });
        });
    });
}

function addBook(bookData) {
    let { name, price, author } = bookData;
    return new Promise((resolve, reject) => {
        if (!name || (!price && price !== 0) || !author) reject({ message: "Invalid inputs" });

        let newBook = {
            id: crypto.randomUUID(),
            name,
            price,
            author,
            isBooked: 0,
        };
        readFile(dbPath, (err, data) => {
            if (err) reject({ message: "An error occurred while fetching data from the database" });
            let newData = JSON.parse(data);
            if (!newData.books) newData.books = [];
            newData.books.push(newBook);
            writeFile(dbPath, JSON.stringify(newData), (err) => {
                if (err)
                    reject({ message: "An error occurred while adding the book to the database" });
                resolve({ message: "The book has been added to the database successfully" });
            });
        });
    });
}

function editBook(id, newData) {
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
}
