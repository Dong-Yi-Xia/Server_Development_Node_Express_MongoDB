var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user');
let passport = require('passport');
let authenticate = require('../authenticate');
const cors = require('./cors')

var router = express.Router();
router.use(bodyParser.json())


// endpoint => /users
router.options('*', cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
    .then(user => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user)
    }, err => next(err))
    .catch(err => next(err))
});

// endpoint => /users/signup
router.post('/signup', cors.corsWithOptions, (req,res,next) => {
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
router.post('/login', cors.corsWithOptions, (req,res,next) => {
    //instead of passing the passport.authenticate('local') after cors
    passport.authenticate('local', (err, user, info) => {
      //a real error, not incorrect user or password
      if(err) 
        return next(err)

      //either that user or password is incorrect, user is null
      if(!user){ 
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json')
        res.json({success:false, status: `Boo, Login Unsuccessful`, err:info})
      }

      //the user object is not null
      //passport.authenticate will provide the req.logIn()
      req.logIn(user, (err) => {
        if(err){
          res.statusCode = 401
          res.setHeader('Content-Type', 'application/json')
          res.json({success:false, status: `Boo, Login Unsuccessful`, err:'Could not log in user'})
        }

        //up to this point user has successfully logged in 
        let token = authenticate.getToken({_id: req.user._id})
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({success:true, status: `Yay, Login Successful`, token: token})
      })
    }) (req,res,next); //at the end of passport.authenticate append a (req,res,next)
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

// endpoint => /users/facebook/token
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  //once passport.authenticate('facebook-token') middleware is successful the req.user is loaded
  if(req.user){
    let token = authenticate.getToken({_id: req.user._id})
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    //send the Token to the client 
    res.json({success:true, token: token, status: `Yay, You're Successfully Logged In using FB OAuth`})
  }  
})

router.get('/checkJWTToken', cors.corsWithOptions, (req,res) => {
  passport.authenticate('jwt', {session:false}, (err,user,info) => {
    if(err)
      return next(err)
    
    if(!user){
      res.statusCode= 401
      res.setHeader('Content-Type', 'application/json')
      return res.json({status: 'JWT invalid', success: false, err: info})
    }
    else{
      res.statusCode= 200
      res.setHeader('Content-Type', 'application/json')
      return res.json({status: 'JWT valid', success: true, user: user})
    }  
  }) (req,res); //at the end of passport.authenticate append a (req,res)
})


module.exports = router;
