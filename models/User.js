const { readFile, writeFile } = require("fs");

const dbPath = "./db.json";

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
