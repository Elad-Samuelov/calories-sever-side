if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Calories = require('../models/calories');

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to DB successfully');

        // Clear existing data
        return Calories.deleteMany();

    })
    .then(() => {
        console.log('Cleared existing data');
        mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
        mongoose.connection.close();
    })