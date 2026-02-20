const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { hotelId, tripId, checkIn, checkOut, totalCost } = req.body;

        if (!hotelId || !checkIn || !checkOut || !totalCost) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            hotelId,
            tripId,
            checkIn,
            checkOut,
            totalCost,
        });

        return res.status(201).json(booking);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create booking' });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate('hotelId');
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

module.exports = {
    createBooking,
    getBookings,
};
