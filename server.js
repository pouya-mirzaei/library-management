const http = require("http");
const { readFile, writeFile } = require("fs");
const {
    returnAllBooks,
    deleteBooks,
    addBookToDb,
    editController,
} = require("./controllers/bookController");
const { returnAllUsers } = require("./controllers/userController");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const dbPath = "./db.json";

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
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            if (!body) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "You should pass the inputs" }));
                return;
            }
            let userData = JSON.parse(body);
            registerUser(userData)
                .then((response) => {
                    res.writeHead(201, { "Content-Type": "application/json" });
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
function registerUser(userInfo) {
    return new Promise((resolve, reject) => {
        let { name, username, password } = userInfo;
        if (!name || !username || !password) {
            reject({ message: "Invalid inputs :(" });
            return;
        }

        let newUser = {
            id: crypto.randomUUID(),
            name: name.toString(),
            username: username.toString(),
            password: password.toString(),
            role: "USER",
            fined: 0,
        };
        readFile(dbPath, (err, data) => {
            if (err) {
                reject({ message: "An error occurred while fetching data from the database" });
                return;
            }
            let newData = JSON.parse(data);

            let flag = false;
            newData.users.forEach((user) => {
                if (user.username === username) {
                    reject({ message: "That username already exists , try another one ..." });
                    flag = true;
                }
            });
            if (flag) return;

            if (!newData.users) newData.users = [];
            newData.users.push(newUser);

            writeFile(dbPath, JSON.stringify(newData), (err) => {
                if (err) {
                    reject({ message: "An error occurred while registering new user" });
                    return;
                }
                resolve({ message: "The ner user has been registered successfully" });
            });
        });
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ...`);
});
