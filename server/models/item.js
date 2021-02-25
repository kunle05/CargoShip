const mongoose = require('mongoose');
const TrackerSchema = require('./tracker').schema;

const ItemSchema = new mongoose.Schema({
    num: {type: Number, required: true},
    status: {type: TrackerSchema},
    content: {type: String, enum: ['Small Electronic', 'Large Electronics', 'Food Products', 'Clothing', 'Automobile', 'General goods']},
    weight: {type: Number, required: [true, 'Provide package weight'], min: 1},
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;