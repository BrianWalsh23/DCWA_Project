const { MongoClient } = require("mongodb");

let db;

async function connectToDatabase() {
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    db = client.db("proj2024MongoDB"); 
    console.log("Connected to MongoDB!");
    return db;
}

async function getLecturers() {
    if (!db) {
        throw new Error("Database not initialized. Call connectToDatabase first.");
    }
    return await db.collection("lecturers").find().toArray();
}

module.exports = { connectToDatabase, getLecturers };
