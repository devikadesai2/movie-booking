const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBookingDB')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const movies = [
    {
        title: "Inception",
        genre: "Sci-Fi",
        poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology...",
        rating: 8.8,
        showtimes: [
            { time: "10:00 AM", price: 12, seats: {} },
            { time: "02:00 PM", price: 15, seats: {} },
            { time: "06:00 PM", price: 18, seats: {} }
        ]
    },
    {
        title: "The Dark Knight",
        genre: "Action",
        poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
        rating: 9.0,
        showtimes: [
            { time: "11:00 AM", price: 12, seats: {} },
            { time: "03:00 PM", price: 15, seats: {} },
            { time: "07:00 PM", price: 18, seats: {} }
        ]
    },
    {
        title: "Interstellar",
        genre: "Sci-Fi",
        poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        rating: 8.6,
        showtimes: [
            { time: "09:00 AM", price: 12, seats: {} },
            { time: "01:00 PM", price: 15, seats: {} },
            { time: "05:00 PM", price: 18, seats: {} }
        ]
    }
];

const seedDB = async () => {
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log('Movies Seeded');
    mongoose.connection.close();
};

seedDB();
