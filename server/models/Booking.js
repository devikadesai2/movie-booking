const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showtime: { type: String, required: true },
    seats: [{ type: String, required: true }], // Array of seat IDs like "A1", "A2"
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
