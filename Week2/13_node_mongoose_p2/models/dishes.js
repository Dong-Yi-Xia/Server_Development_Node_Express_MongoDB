const mongoose = require('mongoose')
const Schema = mongoose.Schema

//can also be written like so
// const { Schema } = mongoose;

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
        type: String,
        required: true
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
    //creating subdocumemts inside a schema
    comments: [ commentSchema ]
},{
    timestamps: true
})

// firt parameter is the name of model. Have to be singular. 
// The collection will automatically convert it into plural
let Dishes = mongoose.model('Dish', dishSchema)

module.exports = Dishes





