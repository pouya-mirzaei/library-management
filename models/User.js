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

module.exports = {
    getAllUsers,
    registerUser,
};
