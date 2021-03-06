var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//import express session and session-file-store
let session = require('express-session')
//keep track of session inside a new automatically created folder sessions
let FileStore = require('session-file-store')(session)  


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


function auth(req, res, next){
  console.log(req.session)
  
  //if signed cookies of user doesn't exist
  if(!req.session.user) {
    let authHeader = req.headers.authorization
    if(!authHeader){
      let err = new Error('Boo!! You are not authenticated!!!!!')
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      next(err)
    }
    //Basic JGJAkw99sdjasl20rdiud ==> ["Basic", "JGJAkw99sdjasl20rdiud"] ==> username:password
    let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    let username = auth[0]
    let password = auth[1]
  
    if(username === 'admin' && password === 'password'){
      //request coming in
      req.session.user = 'admin'
      //if correct, process to the next middleware
      next()
    }else {
      let err = new Error('Boo!! You are not authenticated!!!!!')
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401;
      next(err)
    }
  }
  //if signed cookies exist and user is defined
  else{
    if(req.session.user === 'admin'){
      next()
    }else{
      let err = new Error('Boo!! You are not authenticated!!!!!')
      res.status = 401
      next(err)
    }
  }

}

app.use(auth)

// need authorization before accessing the middleware below 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
