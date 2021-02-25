const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String},
    address: {type: String, required: true},
    status: {type: Number, default: 1}
}, {timestamps: true})

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;