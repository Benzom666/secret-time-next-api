/*
* Schema for country table
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const countrySchema =  new Schema({
    name:{ type: String, unique: true },
    isAvailable: { type: Number, default: 1 },
})

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
