if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const User = require('../models/users');
const Calories = require('../models/calories');

const sample = (arr) => arr[Math.floor(Math.random()*arr.length)];

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to DB successfully');

        // Clear existing data
        return Promise.all([
            User.deleteMany(),
            Calories.deleteMany()
        ]);
    })
    .then(() => {
        console.log('Cleared existing data');

        // Seed user data
        const user = {
            _id: 123123,
            first_name: 'moshe',
            last_name: 'israeli',
            birthday: new Date('1990-10-01')
        };

        // Insert user
        return User.create(user);
    })
    .then((user) => {
        console.log('User inserted:', user);

        // Seed calorie data
        const categories = ['breakfast', 'lunch', 'dinner', 'other'];
        const calories = [];

        for (let i = 1; i <= 20; i++) {
            const category = sample(categories);
            calories.push({
                user_id: user._id,
                year: Math.ceil(Math.random()*3) + 2019,
                month: Math.ceil(Math.random()*3),
                day: Math.ceil(Math.random()*30),
                description: `${category} ${i}`,
                category: category,
                amount: Math.ceil(Math.random()*500) + 100
            });
        }

        // Insert calorie entries
        return Calories.insertMany(calories);
    })
    .then(() => {
        console.log('Calories inserted');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error seeding data:', err);
        mongoose.connection.close();
    });
