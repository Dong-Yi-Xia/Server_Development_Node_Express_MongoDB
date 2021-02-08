var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//import express session and session-file-store
let session = require('express-session')
//keep track of session inside a new automatically created folder sessions
let FileStore = require('session-file-store')(session)  

//import the passport and the authenticate
let passport = require('passport')
let authenticate = require('./authenticate')

let config = require('./config')

//import the Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');  
var commentRouter = require('./routes/commentRouter');  


//added mongoose and dishes model
const mongoose = require('mongoose')
const Dishes = require('./models/dishes')
const Promo = require('./models/promotions')
const Leader = require('./models/leaders')
const Favorite = require('./models/favorite')

//update the url using the config file, where url is centralized 
const url = config.mongoUrl
const connect = mongoose.connect(url, {useNewUrlParser: true})

connect.then((db) => {
  console.log('Connected correctly to server, Nya!')
}, (err) => {console.log(err)})


var app = express();

//in case the accessing the insecure, redirect to secure port
app.all('*', (req, res, next) => {
  if(req.secure){
    return next()
  }
  else{
    //statuscode: 307 ==> temporary redirect
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url)
  }
})

// view engine setup
// using middleware, apply in the order of code
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//apply the passport middleware
app.use(passport.initialize())

//no longer need session middleware, Token doesn't need session
//no longer need the auth method because of passport.authenticate('jwt', {session: false})  

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);


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

module.exports = app;
