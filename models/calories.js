// Elad Samuelov 314752643
// models/calories.js

//Requiring modules
const mongoose = require('mongoose');

//Setting DB schema
const caloriesSchema = new mongoose.Schema({
    user_id: { type: Number, ref: 'User', required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true }
});

//Creating model
const Calories = mongoose.model('Calories', caloriesSchema);

//Exporting model
module.exports = Calories;
