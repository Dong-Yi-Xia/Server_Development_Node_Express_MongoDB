const mongoose = require('mongoose')
const Schema = mongoose.Schema



const favoriteScheme = {
    user: {type: Schema.Types.ObjectId, ref:'User'},
    dishes: [{type: Schema.Types.ObjectId, ref:'Dish'}]
}

const Favorite = mongoose.model('Favorite', favoriteScheme)
module.exports = Favorite


// exports.Favorite = mongoose.model('Favorite', favoriteScheme)
// module.exports = mongoose.model('Favorite', favoriteScheme)
