const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

// Create a booking
router.post('/', async (req, res) => {
    const { userId, movieId, showtime, seats, totalAmount } = req.body;
    try {
        // 1. Create Booking
        const booking = new Booking({ userId, movieId, showtime, seats, totalAmount });
        await booking.save();

        // 2. Update Movie seats
        const movie = await Movie.findById(movieId);
        booking.seats.forEach(seat => {
            // Find the showtime and update seat availability
            // Note: This is a simplified logic. In a real app, you'd need robust searching for the showtime index
            const show = movie.showtimes.find(s => s.time === showtime);
            if (show) {
                show.seats.set(seat, true); // Mark as booked
            }
        });
        // Mark modified because we are updating a nested object in an array
        movie.markModified('showtimes');
        await movie.save();

        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(500).json({ message: 'Booking failed', error: error.message });
    }
});

// Get user bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate('movieId', 'title poster');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // 1. Free up seats in Movie
        const movie = await Movie.findById(booking.movieId);
        if (movie) {
            const show = movie.showtimes.find(s => s.time === booking.showtime);
            if (show) {
                booking.seats.forEach(seat => {
                    show.seats.set(seat, false); // Mark as available
                });
                movie.markModified('showtimes');
                await movie.save();
            }
        }

        // 2. Delete Booking
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Cancellation failed', error: error.message });
    }
});

module.exports = router;
