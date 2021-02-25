const mongoose = require('mongoose');
const UserSchema = require('./user.js').schema;

const TrackerSchema = new mongoose.Schema({
    action: {type: String, enum: ['Received', 'Shipped', 'Picked Up'], required: [true, 'Choose an option']},
    user: {type: UserSchema},
}, {timestamps: true})

const Tracker = mongoose.model('Tracker', TrackerSchema);

module.exports = Tracker;
