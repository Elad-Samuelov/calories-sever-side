//Elad Samuelov 314752643
//f

// models/users.js

//Requiring modules
const mongoose = require('mongoose');

//Setting DB schema
const userSchema = new mongoose.Schema({
    //_id: { type: Number, required: true },
    id: { type: Number, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: Date, required: true }
});

//Creating model
const User = mongoose.model('User', userSchema);

//Exporting model
module.exports = User;
