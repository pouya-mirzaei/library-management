const { readFile, writeFile } = require("fs");
require("dotenv").config();

const dbPath = process.env.dbPath;

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        readFile(dbPath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data).users);
        });
    });
};

module.exports = {
    getAllUsers,
};
