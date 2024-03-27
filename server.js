const http = require("http");
const { readFile, writeFile } = require("fs");
const {
    returnAllBooks,
    deleteBooks,
    addBookToDb,
    editController,
} = require("./controllers/bookController");
const { returnAllUsers, registerUserController } = require("./controllers/userController");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    let { url: reqUrl, method } = req;
    let fullUrl = new URL(reqUrl, `http://localhost:${process.env.PORT}`);
    let { pathname } = fullUrl;

    if (method === "GET" && reqUrl === "/api/books") {
        console.log("get request ");
        returnAllBooks(req, res);
    } else if (method === "GET" && reqUrl === "/api/users") {
        returnAllUsers(req, res);
    } else if (method === "DELETE" && pathname === "/api/books") {
        deleteBooks(req, res);
    } else if (method === "POST" && reqUrl === "/api/books") {
        addBookToDb(req, res);
    } else if (method === "PUT" && pathname === "/api/books") {
        editController(req, res);
    } else if (method === "POST" && reqUrl === "/api/users/register") {
        registerUserController(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "This api does not exists :(" }));
        res.end();
    }
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ...`);
});
