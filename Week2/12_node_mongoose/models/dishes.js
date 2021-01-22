const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    }
},{
    timestamps: true
})

// firt parameter is the name of model. Have to be singular. 
// The collection will automatically convert it into plural
let Dishes = mongoose.model('Dish', dishSchema)

module.exports = Dishes




