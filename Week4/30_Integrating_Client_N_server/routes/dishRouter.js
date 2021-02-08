const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

//require the dishes model
const Dishes = require('../models/dishes')


const dishRouter = express.Router()
dishRouter.use(bodyParser.json())
//the body of the request is parse into the format of JSON

//acesscing the dishes model
dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Dishes.find(req.query) //update with find(req.query)
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, (err) => next(err))
    .catch((err) => next(err))
})

//first execute the middleware, it successful move on to the req,res,next
//else it will response with error message
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log(`Dish Created ${dish}`)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
    }, (err) => next(err))
    .catch((err) => next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /dishes`)
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    // Dishes.deleteMany({})
    Dishes.remove({})
    .then((response) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
    },(err) => next(err))
    .catch((err) => next(err))
})

//with :dishId
dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true})
    .then((dish) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    // Dishes.findByIdAndDelete(req.params.dishId)
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((response) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
    },(err) => next(err))
    .catch((err) => next(err))
})

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////



module.exports = dishRouter


