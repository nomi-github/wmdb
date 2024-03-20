const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'wmdb';

// Function to connect to MongoDB
async function connectToMongoDB() {
    try {
        const client = await MongoClient.connect(url);
        console.log('Connected successfully to MongoDB');
        return client.db(dbName);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}
 
// Function to create a new user
async function createUser(name, username, password, address) {
    try {
        const db = await connectToMongoDB();
        const usersCollection = db.collection('Users');
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await usersCollection.insertOne({ username, password: hashedPassword });
        console.log('User created successfully:', result);
        return result;
    } catch (error) {
        console.error('Failed to create user:', error);
        throw error;
    }
}

// Function to find a user by username
async function findUserByUsername(username) {
    try {
        const db = await connectToMongoDB();
        const usersCollection = db.collection('Users');
        const user = await usersCollection.findOne({ "username": username });
        return user;
    } catch (error) {
        console.error('Failed to find user:', error);
        throw error;
    }
}

// Function to verify user credentials
async function verifyUserCredentials(username, password) {
    try {
        const user = await findUserByUsername(username);
        console.log('user: ' + JSON.stringify(user));
        if (!user) {
            return false; // User not found
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('password match', user.password, passwordMatch);
        const latestMovie = await getLatestMovie(username);
        return { loginResult: passwordMatch, latestMovie: latestMovie };
    } catch (error) {
        console.error('Failed to verify user credentials:', error);
        throw error;
    }
}

// Function to get latest movie for a user
async function getLatestMovie(username) {
    try {
        const db = await connectToMongoDB();
        const usersMoviesCollection = db.collection('UserMovies');
        const userMovies = await usersMoviesCollection.findOne({ "username": username });
        return userMovies;
    } catch (error) {
        console.error('Failed to find user movies:', error);
        throw error;
    }
}

// Function to add a movie to a user
async function addMovieToUser(username, movieId) {
    try {
        const db = await connectToMongoDB();
        const usersCollection = db.collection('Users');
        const user = await usersCollection.findOne({ "username": username });
        if (user) {
            const collection = db.collection('UserMovies');
            const existingUser = await collection.findOne({ username: username });

            if (existingUser) {
                const result = await collection.updateOne(
                    { username: username },
                    { $set: { movie: movieId } }
                );
                console.log(`${result.modifiedCount} document(s) updated. Added movie ${movieId} to user ${username}.`);
                return result.modifiedCount;
            } else {
                // If the user doesn't exist, create a new document with the provided username and movieId
                const result = await collection.insertOne({
                    username: username,
                    movie: movieId
                });
                console.log(`New document created for user ${username}. Added movie ${movieId}.`);
                return result.insertedCount;
            }
        }
    } catch (error) {
        console.error('Error adding movie to user:', error);
        throw error;
    }
}

// Dummy users data
const dummyUsers = [
    { name: 'John Doe', username: 'john_doe', password: 'password1', address: '123 Main St' },
    { name: 'Alice Smith', username: 'alice_smith', password: 'password2', address: '456 Elm St' },
    { name: 'Bob Johnson', username: 'bob_johnson', password: 'password3', address: '789 Oak St' },
    { name: 'Emily Davis', username: 'emily_davis', password: 'password4', address: '101 Pine St' },
    { name: 'Michael Wilson', username: 'michael_wilson', password: 'password5', address: '202 Cedar St' }
];

async function insertDummyUsers() {
    try {
        for (const user of dummyUsers) {
            // Hash the password before inserting
            // Insert user into database
            await createUser(user.name, user.username, user.password, user.address);
            console.log(`User ${user.username} inserted successfully`);
        }
    } catch (error) {
        console.error('Error inserting dummy users:', error);
    }
}

// Execute the function to insert dummy users
//insertDummyUsers();


// Exporting methods
module.exports = {
    db: {
        verifyUserCredentials: verifyUserCredentials,
        createUser: createUser,
        getLatestMovie: getLatestMovie,
        addMovieToUser: addMovieToUser
    }
};


