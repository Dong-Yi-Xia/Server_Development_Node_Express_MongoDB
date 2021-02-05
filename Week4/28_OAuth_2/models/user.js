let mongoose = require('mongoose')
let Schema = mongoose.Schema
let passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    firstname:{
        type: String,
        default: ''
    },
    lastname:{
        type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
})

//automatically add-in the username and password field, that is hashed and salt
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)


