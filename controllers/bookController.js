const { Long } = require("mongodb");
const { getAllBooks, deleteBook, addBook, editBook } = require("../models/Books");

const returnAllBooks = async (req, res) => {
    const books = await getAllBooks();

    res.writeHead(200, { "Content-type": "application/json" });
    res.write(JSON.stringify(books));
    res.end();
};

const deleteBooks = async (req, res) => {
    let fullUrl = new URL(req.url, "http://localhost:3001");

    const deleteResult = await deleteBook(fullUrl.searchParams.get("id"));
    res.writeHead(deleteResult.code, { "Content-Type": "application/json" });
    res.write(JSON.stringify(deleteResult));
    res.end();
};

const addBookToDb = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", async () => {
        if (!body) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "give me some data bitch", isOk: false, code: 400 }));
            return;
        }
        let data = JSON.parse(body);
        const result = await addBook(data);

        res.writeHead(result.code, { "Content-Type": "application/json" });
        res.write(JSON.stringify(result));
        res.end();
    });
};

const editController = (req, res) => {
    let { url: reqUrl } = req;
    let fullUrl = new URL(reqUrl, `http://localhost:${process.env.PORT}`);
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
};

module.exports = {
    returnAllBooks,
    deleteBooks,
    addBookToDb,
    editController,
};
