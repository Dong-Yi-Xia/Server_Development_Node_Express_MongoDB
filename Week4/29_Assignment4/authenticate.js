let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let User = require('./models/user')

let JwtStrategy = require('passport-jwt').Strategy
let ExtractJwt = require('passport-jwt').ExtractJwt
let jwt = require('jsonwebtoken')

let FacebookTokenStrategy = require('passport-facebook-token')

let config = require('./config')

//Because of Passport-Local-Mongoose Plugin we can use authenticate() method
exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//////////////////
//using the require('jsonwebtoken') to create a Token
exports.getToken = function(user){
    //sign(payload, secret, option) //expires in 3600s econds
    return jwt.sign(user, config.secretKey, {expiresIn: 3600})
}

//create a new object
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

//create a new JwtStrategy
exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log(`Yo, JWT payload: ${jwt_payload}`)
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err){
                return done(err, false)
            }
            else if (user){
                return done(null, user)
            }
            else{
                return done(null, false)
            }
        })
    }))

//we don't want any session saved on the server because we are using Token Based Authenication    
//authenticate in the header because line 26, fromAuthHeaderAsBearerToken
//now can use the verifyUser function in other files using the jwt authentication 
exports.verifyUser = passport.authenticate('jwt', {session: false})    



//a callback function in the REST API Route 
exports.verifyAdmin = function(req,res,next){
    if(req.user.admin){
        return next()
    }
    let err = new Error('NEVER!, You are not authorized to perform this operation!')
    err.status = 403
    return next(err)
} 

/////////////////////////////////////////////

exports.facebookPassport = passport.use(new 
    FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
        //2nd, parameter is a callback, the profile is the info coming from OAuth FB server
    }, (accessToken, refreshToken, profile, done) => {
        //check to see if User already used FB OAuth approach, if facebookId exist 
        User.findOne({facebookId: profile.id}, (err, user) => {
            if(err){
                return done(err, false)
            }
            //user found, using FB OAuth approach, pass by the user 
            if(!err && user !== null){
                return done(null, user)
            }
            //create a new user and save the facebookId
            else{
                user = new User({username: profile.displayName})
                user.facebookId = profile.id
                user.firstname = profile.name.givenName
                user.lastname = profile.name.familyName
                user.save((err,user) => {
                    if(err)
                        return done(err, false)
                    else 
                        return done(null, user)    
                })
            }
        })
    }
))

//after creating the FacebookTokenStrategy. 
//We can now use passport.authenticate('facebook-token') to check for authenication 
