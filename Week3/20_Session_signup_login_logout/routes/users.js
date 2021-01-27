var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user');


var router = express.Router();
router.use(bodyParser.json())


// endpoint => /users
router.get('/', function(req, res, next) {
  User.find({})
    .then(user => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user)
    }, err => next(err))
    .catch(err => next(err))
});

// endpoint => /users/signup
router.post('/signup', (req,res,next) => {
   User.findOne({username: req.body.username})
   .then(user => {
      if(user !== null){
        let err = new Error(`User ${req.body.username} alreay exist`)
        err.status = 403
        next(err)
      } 
      else{
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
      }
   })
   .then(user => {
     // return the newly created user
     res.statusCode = 200
     // setHeader to be application/json for a json response
     res.setHeader('Content-Type', 'application/json')
     // send back response to client in json with 2 fields 
     res.json({status: `Registration Successful`, user: user})
   }, err => next(err))
   .catch(err => next(err)) 
})

// endpoint => /users/login
router.post('/login', (req,res,next) => {
  //if req.session.user === null
  if(!req.session.user) {
    let authHeader = req.headers.authorization;
    //check the authorization field whether it is filled or not
    if (!authHeader) {
      let err = new Error('Boo!! You are not authenticated!!!!!')
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }
    //Basic JGJAkw99sdjasl20rdiud ==> ["Basic", "JGJAkw99sdjasl20rdiud"] ==> username:password
    let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    let username = auth[0]
    let password = auth[1]
  
    //find a single user in the database
    User.findOne({username: username})
    .then(user => {   
      //user doesn't exist 
      if(user === null){
        let err = new Error(`Boo!! ${username} does not exist`)
        res.setHeader('WWW-Authenticate', 'Basic')
        err.status = 401;
        return next(err)
      } 
      //user exist but password doesn't match
      else if(user.password !== password){
        let err = new Error(`Boo!! Your password ${password} is not correct`)
        res.setHeader('WWW-Authenticate', 'Basic')
        err.status = 401;
        return next(err)
      }
      else if(user.username === username && user.password === password){
        //request coming in and set req.session.user to be 'authenticated'
        req.session.user = 'authenticated'
        res.statusCode = 200
        // setHeader to be text/plain for a plain text response
        res.setHeader('Content-Type', 'text/plain')
        res.end('Yay, You are authenticated')
      }
    })
    .catch(err => next(err))
  }

  //if req.session.user already exist
  else{
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('You are already authenticated')
  }
})

// endpoint => /users/logout
router.get('/logout', (req,res,next) => {
  //if the req.session.user exist, user is logged in
  if(req.session.user){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    let err = new Error('You are not logged in')
    err.status = 403
    return next(err)
  }
})


module.exports = router;
