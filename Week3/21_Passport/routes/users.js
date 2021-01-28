var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user');
let passport = require('passport')

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
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json({success:true, status: `Registration Successful`, user:user})
            })
          }
   })
})


// endpoint => /users/login
router.post('/login', passport.authenticate('local'), (req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({success:true, status: `Yay, You're Successfully Logged In`})
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
