const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cities: [{
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }],
    optimizedRoute: [{
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
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
