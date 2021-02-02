const mongoose = require('mongoose')
const Schema = mongoose.Schema

//loading mongoose-currency into mongoose 
require('mongoose-currency').loadType(mongoose)
//creating a new type value
const Currency = mongoose.Types.Currency

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" //reference to the User model, belongs to a User
    }
})


// Schema 2nd parameter as the JSON timestamp when created or updated
const dishSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    label:{
        type: String,
        default: ''
    },
    price:{
        type: Currency,
        required: true,
        min: 0
    },
    feature: {
        type: Boolean,
        default: false
    },
    //creating subdocumemts inside a schema
    comments: [ commentSchema ]
},{
    timestamps: true
})

// firt parameter is the name of model. Have to be singular. 
// The collection will automatically convert it into plural
let Dishes = mongoose.model('Dish', dishSchema)

module.exports = Dishes


// let Comment = mongoose.model('Comment', commentSchema)
// Inside the dish schema
// comments: [ {type: mongoose.Schema.Types.ObjectId, ref: "Comment"} ]
// reference to the Comment model(singular), A dish has many comments









