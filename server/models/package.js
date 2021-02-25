const mongoose = require('mongoose');
const ItemSchema = require('./item').schema;
const LocationSchema = require('./location').schema;

const PackageSchema = new mongoose.Schema({
    shipper_name: {type: String, required: [true, 'Provide full shipper name'], minlength: [5, 'Provide a valid name']},
    shipper_phone: {type: Number, required: [true, 'Shipper phone no. cannot be blank'], minlength: [10, 'Provide a valid phone number']},
    receiver_name: {type: String, required: [true, 'Provide full receiver name'], minlength: [5, 'Provide a valid name']},
    receiver_phone: {type: Number, required: [true, 'Receiver phone no. cannot be blank'], minlength: [10, 'Provide a valid phone number']},
    amount: {type: mongoose.Decimal128, required: [true, 'Enter total amount']},
    paid: {type: mongoose.Decimal128, required: [true, 'Enter amount paid']},
    del_date: {type: Date, required: true},
    tracking_code: {type: String, required: [true, 'Tracking code cannot be empty'], minlength: [6, 'Provide a valid code']},
    origin_loc: {type: LocationSchema},
    destination: {type: LocationSchema},
    status: {type: String, enum: ['Received', 'Shipped', 'Picked Up', 'Other']},
    item_count: [ {type: ItemSchema} ]
}, {timestamps: true});

mongoose.model('Package', PackageSchema);