const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "libraryManagement";

client.connect().then((res) => {
    console.log(res);
});
