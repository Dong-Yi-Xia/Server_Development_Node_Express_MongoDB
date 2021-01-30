var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user');
let passport = require('passport');
let authenticate = require('../authenticate');

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
   User.register(new User({username: req.body.username}), 
        req.body.password, 
        (err, user) => {
          if(err){
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.json({err: err})
          } 
          else{
            if(req.body.firstname){
              user.firstname = req.body.firstname
            }
            if(req.body.lastname){
              user.lastname = req.body.lastname
            }
            user.save((err,user) => {
              if(err){
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({err: err})
                return
              }
              passport.authenticate('local')(req, res, () => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({success:true, status: `Registration Successful`, user:user})
              })
            })
          }
   })
})


// endpoint => /users/login
router.post('/login', passport.authenticate('local'), (req,res,next) => {
    //Because passport.authenticate('local') user is valid, therefore we can use req.user._id
    //create a Token by the server, method coming from import on line 5 
    let token = authenticate.getToken({_id: req.user._id})
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    //send the Token to the client 
    res.json({success:true, token: token, status: `Yay, You're Successfully Logged In`})
})


// endpoint => /users/logout
router.get('/logout', (req,res,next) => {
  //destroy and clear out the user session
  if(req.session){
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
