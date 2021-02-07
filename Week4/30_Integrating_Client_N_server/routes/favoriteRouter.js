const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')
const Favorites = require('../models/favorite')

const favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=> {
    // Favorites.find({user: req.user._id})  
    // find() will return an array findOne() return a single {}
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then(favorites => {
        if(favorites === null){
            res.end('You have no favorite dishes')
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorites)
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=> {
    Favorites.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite !== null){
            for(let i=0; i<req.body.length; i++){
                if(!favorite.dishes.includes(req.body[i]._id) ){
                    favorite.dishes.push(req.body[i]._id)
                }
            }
            favorite.save()
            // Favorites.findByIdAndUpdate(favorite._id, 
            //     {dishes: favorite.dishes },
            //     {new: true} //return the updated version
            // )
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then(favorite => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite)
                })
            })
            .catch(err => next(err))             
        }
        else{
            Favorites.create({
                user: req.user._id,
                dishes: req.body
            })
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then(favorite => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite)
                })
            })
            .catch(err => next(err))
        }
    })
})


.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=> {
    Favorites.findOneAndDelete({user: req.user._id})
    .then((favorite) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorite)
    }, (err) => next(err))
    .catch((err) => next(err))
})


//////////////////////////

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then(favorites => {
        if(!favorites){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            return res.json({'exists': false, 'favorites': favorites})
        }
        else{
            if(favorite.dishes.indexOf(req.params.dishId) < 0){
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                return res.json({'exists': false, 'favorites': favorites})
            }
            else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                return res.json({'exists': true, 'favorites': favorites})
            }
        }
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=> {
    Favorites.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite !== null){   
            if(!favorite.dishes.includes(req.params.dishId) ){
                favorite.dishes.push(req.params.dishId)
            }
            favorite.save()
            // Favorites.findByIdAndUpdate(favorite._id, 
            //     {dishes: favorite.dishes },
            //     {new: true}
            // )
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then(favorite => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite)
                })
            })
            .catch(err => next(err))               
        }
        else{
            Favorites.create({
                user: req.user._id,
                dishes: [req.params.dishId]
            })
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then(favorite => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite)
                })
            })
            .catch(err => next(err))
        }
    }) 
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=> {
    Favorites.findOne({user: req.user._id})
    .then(favorite => {
        const index = favorite.dishes.indexOf(req.params.dishId);
        if (index !== -1) {
            favorite.dishes.splice(index, 1);
            favorite.save()
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then(favorite => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(favorite)
                })
            })
            .catch(err => next(err))
        }
        else {
            err = new Error(`Dish ${req.params.dishId} not found`);
            err.status = 404;
            return next(err)
        }
    })
})

module.exports = favoriteRouter