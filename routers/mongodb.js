const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'wmdb';

// Function to connect to MongoDB
function connectToMongoDB() {
  try {
    const client = MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected successfully to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Function to create a new user
function createUser(username, password) {
  try {
    const db = connectToMongoDB();
    const usersCollection = db.collection('Users');
    const hashedPassword = bcrypt.hash(password, 10);
    const result = usersCollection.insertOne({ username, password: hashedPassword });
    console.log('User created successfully:', result.ops[0]);
    return result.ops[0];
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// Function to find a user by username
function findUserByUsername(username) {
  try {
    const db = connectToMongoDB();
    const usersCollection = db.collection('Users');
    const user = usersCollection.findOne({ username });
    return user;
  } catch (error) {
    console.error('Failed to find user:', error);
    throw error;
  }
}

// Function to verify user credentials
function verifyUserCredentials(username, password) {
  try {
    const user = findUserByUsername(username);
    if (!user) {
      return false; // User not found
    }
    const passwordMatch = bcrypt.compare(password, user.password);
    return passwordMatch;
  } catch (error) {
    console.error('Failed to verify user credentials:', error);
    throw error;
  }
}


// Exporting methods
module.exports = {
  db: {
    verifyUserCredentials: verifyUserCredentials,
    createUser: createUser
  }
};
