const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Promo = require('../models/promotions')

const promotionsRouter = express.Router()
promotionsRouter.use(bodyParser.json())

promotionsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Promo.find(req.query) //update with find(req.query)
    .then(promotions => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotions)
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promo.create(req.body)
    .then(promotion => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
    }, err => next(err))
    .catch(err => next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /promotions`)
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promo.remove({})
    .then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    }, err => next(err))
    .catch(err => next(err))
})


////////////////////////////////////////////
////////////////////////////////////////////

promotionsRouter.route('/:promotionId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Promo.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /promotions ${req.params.promotionId}`)
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promo.findByIdAndUpdate(req.params.promotionId, 
        {$set: req.body}, 
        {new: true}
    )
    .then(promotion => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
    }, err => next(err))
    .catch(err => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promo.findByIdAndRemove(req.params.promotionId)
    .then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = promotionsRouter