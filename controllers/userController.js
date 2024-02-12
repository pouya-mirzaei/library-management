const { getAllUsers } = require("../models/User");

const returnAllUsers = async (req, res) => {
    const users = await getAllUsers();

    res.writeHead(200, { "Content-type": "application/json" });
    res.write(JSON.stringify(users));
    res.end();
};

module.exports = {
    returnAllUsers,
};
