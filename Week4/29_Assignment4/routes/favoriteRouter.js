const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')
const Favorites = require('../models/favorite')

const favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req,res,next)=> {
    Favorites.find({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then(favorites => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorites)
    }, err => next(err))
    .catch(err => next(err))
})

.post(authenticate.verifyUser, (req,res,next)=> {
    Favorites.find({user: req.user._id})
    .then(favorite => {
        if(favorite.length > 0){
            for(let i=0; i<req.body.length; i++){
                if(!favorite[0].dishes.includes(req.body[i]._id) ){
                    favorite[0].dishes.push(req.body[i]._id)
                }
            }
            Favorites.findByIdAndUpdate(favorite[0]._id, 
                {dishes: favorite[0].dishes },
                {new: true} //return the updated version
            )
            .then(favorite => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
            },err => next(err))
            .catch(err => next(err))             
        }
        else{
            Favorites.create({
                user: req.user._id,
                dishes: req.body
            })
            .then(favorite => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
            },err => next(err))
            .catch(err => next(err))
        }
    })
})


.delete(authenticate.verifyUser, (req,res,next)=> {
    Favorites.remove({})
    .then((favorite) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorite)
    }, (err) => next(err))
    .catch((err) => next(err))
})

//////////////////////////
favoriteRouter.route('/:dishId')
.post(authenticate.verifyUser, (req,res,next)=> {
    Favorites.find({user: req.user._id})
    .then(favorite => {
        if(favorite.length > 0){   
            if(!favorite[0].dishes.includes(req.params.dishId) ){
                favorite[0].dishes.push(req.params.dishId)
            }
            Favorites.findByIdAndUpdate(favorite[0]._id, 
                {dishes: favorite[0].dishes },
                {new: true}
            )
            .then(favorite => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
            },err => next(err))
            .catch(err => next(err))               
        }
        else{
            Favorites.create({
                user: req.user._id,
                dishes: [req.params.dishId]
            })
            .then(favorite => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
            },err => next(err))
            .catch(err => next(err))
        }
    }) 
})

.delete(authenticate.verifyUser, (req,res,next)=> {
    
})

module.exports = favoriteRouter