const { MongoClient } = require("mongodb");
require("dotenv").config();

const url = process.env.DB_URL;
const client = new MongoClient(url);

const dbName = "library";

const main = async () => {
    await client.connect();
    console.log("connected !");
    const db = client.db(dbName);

    // const users = db.collection("users");
    // const result = await users.insertMany([
    //     {
    //         id: 0,
    //         role: "ADMIN",
    //         name: "pouya",
    //         username: "meraxes",
    //         password: "123456",
    //         fined: 0,
    //     },
    //     {
    //         id: 1,
    //         role: "USER",
    //         name: "ali",
    //         username: "ali006",
    //         password: "1111",
    //         fined: 0,
    //     },
    // ]);

    // const books = db.collection("books");
    // const result = await books.insertOne({
    //     id: "b13034ea-80b4-493b-b1ce-dcd2ccf4211e",
    //     name: "Fire and blood",
    //     price: "9.99",
    //     author: "G.R.R.M",
    //     isBooked: 0,
    // });
    // console.log(result);
    // return "done";

    // const bookCollection = db.collection("books");
    // const a = await bookCollection.deleteOne({ name: "Fire and blood" });
    // console.log(a);

    const bookCollection = db.collection("books");
    bookCollection.insertMany([
        {
            id: "b13034ea-80b4-493b-b1ce-dcd2ccf4211e",
            name: "A song of ice and fire",
            price: "9.99",
            author: "G.R.R.M",
            isBooked: 0,
        },
    ]);
    // const result = await bookCollection.deleteOne({ name: "Fire and blood" });
    // console.log(result);

    // const result = await bookCollection.drop();
    // console.log(result);

    // bookCollection.
};

main();
