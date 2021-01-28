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

//import the Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');


//added mongoose and dishes model
const mongoose = require('mongoose')
const Dishes = require('./models/dishes')
const Promo = require('./models/promotions')
const Leader = require('./models/leaders')

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url, {useNewUrlParser: true})

connect.then((db) => {
  console.log('Connected correctly to server, Nya!')
}, (err) => {console.log(err)})


var app = express();

// view engine setup
// using middleware, apply in the order of code
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//supple the secret key in cookieParser
// app.use(cookieParser('12345-67890'));

//instead of cookies use session middleware
app.use(session({
  name: 'session-id',
  secret: '12345-67890',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()  //where session get stored, from line 10
}));

//apply the passport middleware
app.use(passport.initialize())
app.use(passport.session())

// move the index and users Routes before auth, so user can have access to signup and login
app.use('/', indexRouter);
app.use('/users', usersRouter);


function auth(req, res, next){
  if(req.user){
    next()
  }
  else{
    let err = new Error('Boo!! You are not authenticated!!!!!')
    err.status = 401
    return next(err)
  }
}

app.use(auth)

// need authorization before accessing the middleware below 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
