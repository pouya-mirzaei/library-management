const { getAllUsers, registerUser } = require("../models/User");

const returnAllUsers = async (req, res) => {
    const users = await getAllUsers();

    res.writeHead(200, { "Content-type": "application/json" });
    res.write(JSON.stringify(users));
    res.end();
};

const registerUserController = (req, res) => {
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
};

module.exports = {
    returnAllUsers,
    registerUserController,
};
