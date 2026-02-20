const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cities: [{
        type: String,
        required: true,
    }],
    optimizedRoute: [{
        type: String, // Or Object with full city details
        required: true,
    }],
    totalDistance: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        default: 'My Road Trip'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Trip', tripSchema);
