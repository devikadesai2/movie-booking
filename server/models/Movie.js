const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    poster: { type: String, required: true }, // URL to image
    description: { type: String },
    rating: { type: Number, default: 0 },
    showtimes: [
        {
            time: { type: String, required: true }, // e.g., "10:00 AM"
            seats: {
                type: Map,
                of: Boolean, // seatId -> isBooked (true/false)
                default: {}
            },
            price: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
