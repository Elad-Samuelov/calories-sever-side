//Elad Samuelov 314752643


//Requiring modules
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var caloriesRouter = require('./routes/calories');

//Initializing express app
var app = express();

//setting DB connection
console.log('DB_URL from .env:', process.env.DB_URL);

mongoose.connect(process.env.DB_URL)
    .then(data => {console.log('Connected to DB successfully')})
    .catch(err => console.log('CONNECTION TO DB HAS FAILED: ' + err));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//setting middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', caloriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//exporting app
module.exports = app;
