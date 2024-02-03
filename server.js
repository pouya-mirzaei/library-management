const http = require("http");
const { readFile } = require("fs");

const server = http.createServer((req, res) => {
    let { url, method } = req;

    if (method === "GET" && url === "/api/books") {
        readFile("./db.json", (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);
            res.writeHead(200, { "Content-type": "application/json" });
            res.write(JSON.stringify(data.books));
            res.end();
        });
    } else if (method === "GET" && url === "/api/users") {
        readFile("./db.json", (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);
            res.writeHead(200, { "Content-type": "application/json" });
            res.write(JSON.stringify(data.users));
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
