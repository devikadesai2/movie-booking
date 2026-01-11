const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/movieBookingDB';

console.log('Attempting to connect to:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('SUCCESS: Connected to MongoDB');
        const Movie = require('./models/Movie');
        const count = await Movie.countDocuments();
        console.log('Movie count in DB:', count);
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to MongoDB:', err.message);
        process.exit(1);
    });

// Timeout after 10 seconds
setTimeout(() => {
    console.error('TIMEOUT: Connection took too long');
    process.exit(1);
}, 10000);
