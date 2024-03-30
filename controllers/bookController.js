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
            res.end(JSON.stringify({ message: "give me some data bitch", ok: false, code: 400 }));
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

    req.on("end", async () => {
        let data;
        try {
            data = JSON.parse(body);
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid Json, fuck you bitch" }));
            return;
        }

        let id = fullUrl.searchParams.get("id");
        const result = await editBook(id, data);

        res.writeHead(result.code, { "Content-Type": "application/json" });
        res.write(JSON.stringify(result));
        res.end();
    });
};

module.exports = {
    returnAllBooks,
    deleteBooks,
    addBookToDb,
    editController,
};
