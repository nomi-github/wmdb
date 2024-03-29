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
        const result = await usersCollection.insertOne({ name, username, password: hashedPassword });
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
        return null;
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



const fetch = require('node-fetch');

async function insertNowPlayingMoviesIntoDB() {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=15';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2MzNTc5ODE0Y2FmZGNjMWI4MjEyZmZjMzQ5OTNmZiIsInN1YiI6IjY1ZjVmNWY5ZDhmNDRlMDE2MzRlZWQ1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xqxXb1-nAaRKKayR2IQSOAkjn7_21BosjYG9cUHMhYE'
        }
    };

    try {
        // Fetch now playing movies from the API
        const response = await fetch(url, options);
        const json = await response.json();
        const movies = json.results;

        // Connect to MongoDB
        const db = await connectToMongoDB();
        const collection = db.collection('MovieShowTimes');

        // Insert each movie into MongoDB
        for (const movie of movies) {
            const result = await collection.insertOne({
                movie_id: movie.id,
                movie_name: movie.title,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                poster_path: movie.poster_path,
            });
            console.log('Inserted movie details into MongoDB:', result.insertedId);
        }
    } catch (error) {
        console.error('Error inserting now playing movies into MongoDB:', error);
    }
}
async function getMovieDetailsByName(movieNames) {
    try {
        // Connect to MongoDB
        const db = await connectToMongoDB();
        const collection = db.collection('MovieShowTimes');

        // Find movie details for the provided movie names
        const cursor = collection.find({ movie_name: { $in: movieNames } });
        const movieDetailsArray = await cursor.toArray();

        // Create a map to store movie details
        const movieDetailsMap = {};
        movieDetailsArray.forEach((movieDetails) => {
            movieDetailsMap[movieDetails.movie_name] = movieDetails;
        });

        return movieDetailsMap;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
}



// Call the function to insert now playing movies into MongoDB
//insertNowPlayingMoviesIntoDB();



// Execute the function to insert dummy users
//insertDummyUsers();

// Call the function to insert data
//insertMovieShowTimes();


// Exporting methods
module.exports = {
    db: {
        verifyUserCredentials: verifyUserCredentials,
        createUser: createUser,
        getLatestMovie: getLatestMovie,
        addMovieToUser: addMovieToUser,
        getMovieDetailsByName: getMovieDetailsByName,
        findUserByUsername: findUserByUsername
    }
};