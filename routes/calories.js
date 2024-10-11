// Elad Samuelov 314752643

//Requiring modules
const express = require('express');
const { addCalories, report, about ,findById} = require('../controllers/calories');

//Setting router
const router = express.Router();

//Setting routers
router.post('/addcalories', addCalories);
router.get('/report', report);
router.get('/about', about);
router.get('/users/:id',findById);

//Exporting router
router.get('/', (req, res) => {
    res.send('Welcome to the Calories API!');
});

module.exports = router;
