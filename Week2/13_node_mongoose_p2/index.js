const mongoose = require('mongoose')
const Dishes = require('./models/dishes')

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url, {useNewUrlParser: true})

connect.then((db) => {
    console.log('Connected correctly to server')
    // Dishes.deleteMany({})
    // .then(() => {
    //     return mongoose.connection.close()
    // })

    Dishes.create({
        name: 'Happy',
        description: 'BlueCat'
    })
    .then((dish) => {
        console.log(dish)
        return Dishes.findByIdAndUpdate(dish._id,{
            $set: {description: 'RedCat'}
        },{
            //flag field
            new: true
        }).exec()
    })
    .then((dish) => {
        console.log(dish)
        //accessing the comments key, value is an array, to add to array use push()
        dish.comments.push({
            rating: 5,
            comment: 'I am getting a sinking feeling!',
            author: 'Lenoardo di Carpaccio'
        })
        return dish.save()
    })
    .then((dish) => {
        console.log(dish)
        return Dishes.deleteMany({})
    })
    .then(() => {
        return mongoose.connection.close()
    })
    .catch((err) => {
        console.log(err)
    })
})