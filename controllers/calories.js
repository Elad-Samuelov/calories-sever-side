//Elad Samuelov 314752643

// controllers/calories.js
//Requiring modules
const Calories = require('../models/calories');
const User = require('../models/users');
const mongoose = require("mongoose");

//Implementing controller functions
const addCalories = (req, res, next) => {
    //res.send('Adding calories');
    const {user_id, year, month, day, description, category, amount} = req.body;
    Calories.create(req.body)
        .then(doc => res.send(doc))
        .catch((err) => {
            console.log("ERROR CREATING CALORY" + err);
            next();
        });
};

const report = (req, res, next) => {
    Calories.find(req.query)
        .then(calories => {
            const report = {
                breakfast: [],
                lunch: [],
                dinner: [],
                other: []
            };

            for(let cat in report) {
                const filtered = calories.filter(cal => cat === cal.category)
                report[cat] = filtered.map(cal => {
                    return {day: cal.day, description: cal.description, amount: cal.amount};
                });
            }
            res.send(report);
        })
        .catch(next);
};

const about = (req, res) => {
    const developers = [
        { firstname: "Elad", lastname: "Samuelov", id: 314752643, email: "eladsmu@gmail.com" },

    ];

    res.send(developers);
};



const findById = (req, res) => {
    const userId = parseInt(req.params.id, 10); // המרה למספר
    console.log('User ID from request:', userId);

    User.findOne({ id: userId }) // מחפש לפי id ולא _id
        .then(user => {
            if (!user) {
                console.log('User not found in the database');
                return res.status(404).send('User not found');
            }
            res.send(user);
        })
        .catch(err => {
            console.error('Error during DB query:', err);
            res.status(500).send(err);
        });
};

//Exporting controllers
module.exports = { addCalories, report, about ,findById};

