require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DB_URL);

const dbName = "Library";

// const main = async () => {
//     const connection = await client.connect();
//     const db = connection.db(dbName);

//     const usersCollection = db.collection("users");
//     const bookCollections = db.collection("books");

//     const result = await bookCollections.insertMany([
//         {
//             id: 0,
//             name: "fire and blood",
//             price: 10,
//             author: "G.R.R.M",
//             isBooked: 0,
//             createdAt: new Date(),
//         },
//         {
//             id: 1,
//             name: "A song of ice and fire",
//             price: "9.99",
//             author: "G.R.R.M",
//             isBooked: 0,
//             createdAt: new Date(),
//         },
//     ]);

//     return result;

//     // return connection;
// };

// main()
//     .then(console.log)
//     .catch(console.log)
//     .finally(() => {
//         client.close();
//     });

module.exports = {
    db: async () => {
        const connection = await client.connect();
        const db = connection.db(dbName);

        return db;
    },
};
