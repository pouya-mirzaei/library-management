const http = require("http");
const url = require("url");
const { readFile, writeFile } = require("fs");

const dbPath = "./db.json";

const server = http.createServer((req, res) => {
    let { url: reqUrl, method } = req;
    let fullUrl = new URL(reqUrl, "http://localhost:3001");
    let { pathname } = fullUrl;

    if (method === "GET" && reqUrl === "/api/books") {
        readFile("dbPath", (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);
            res.writeHead(200, { "Content-type": "application/json" });
            res.write(JSON.stringify(data.books));
            res.end();
        });
    } else if (method === "GET" && reqUrl === "/api/users") {
        readFile("dbPath", (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);
            res.writeHead(200, { "Content-type": "application/json" });
            res.write(JSON.stringify(data.users));
            res.end();
        });
    } else if (method === "DELETE" && pathname === "/api/books") {
        console.log("here");
        deleteBook(fullUrl.searchParams.get("id"))
            .then((response) => {
                console.log(response);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(response));
                res.end();
            })
            .catch((err) => {
                console.log(err);
                res.writeHead(404, { "Content-Type": "application/json" });
                res.write(JSON.stringify(err));
                res.end();
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
            writeFile(dbPath, JSON.stringify({ ...data, filteredBooks }), (err) => {
                return new Promise((res, rej) => {
                    if (err)
                        reject({
                            message: "There was an error while deleting the book :( try again",
                        });
                    resolve(filteredBooks);
                });
            });
        });
    });
}
