const { getAllBooks, deleteBook, addBook } = require("../models/Books");

const returnAllBooks = async (req, res) => {
    const books = await getAllBooks();

    res.writeHead(200, { "Content-type": "application/json" });
    res.write(JSON.stringify(books));
    res.end();
};

const deleteBooks = (req, res) => {
    let fullUrl = new URL(req.url, "http://localhost:3001");

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
};

const addBookToDb = (req, res) => {
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
};

module.exports = {
    returnAllBooks,
    deleteBooks,
    addBookToDb,
};
