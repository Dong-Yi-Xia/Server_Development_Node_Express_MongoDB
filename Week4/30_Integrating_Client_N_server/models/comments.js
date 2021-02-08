const mongoose = require('mongoose')
const Schema = mongoose.Schema


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
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish' //reference to the Dish model, belongs to a Dish
    }
},{
    timestamps: true
})

let Comments = mongoose.model('Comment', commentSchema)
module.exports = Comments


