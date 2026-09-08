const { MongoClient } = require('mongodb');

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const databaseName = process.env.MONGO_DB || 'ai_project';

const client = new MongoClient(mongoUrl);
let database;

async function connectDatabase() {
  if (!database) {
    await client.connect();
    database = client.db(databaseName);
    console.log(`Connected to MongoDB database: ${databaseName}`);
  }

  return database;
}

async function closeDatabase() {
  await client.close();
  database = undefined;
}

module.exports = {
  closeDatabase,
  connectDatabase,
};
