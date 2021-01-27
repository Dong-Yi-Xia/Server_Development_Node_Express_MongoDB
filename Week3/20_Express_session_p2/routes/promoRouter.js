const express = require('express')
const bodyParser = require('body-parser')

const Promo = require('../models/promotions')

const promotionsRouter = express.Router()
promotionsRouter.use(bodyParser.json())

promotionsRouter.route('/')
.get((req,res,next) => {
    Promo.find({})
    .then(promotions => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotions)
    }, err => next(err))
    .catch(err => next(err))
})

.post((req,res,next) => {
    Promo.create(req.body)
    .then(promotion => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
    }, err => next(err))
    .catch(err => next(err))
})

.put((req,res,next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /promotions`)
})

.delete((req,res,next) => {
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
.get((req,res,next) => {
    Promo.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
    }, err => next(err))
    .catch(err => next(err))
})

.post((req,res,next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /promotions ${req.params.promotionId}`)
})

.put((req,res,next) => {
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

.delete((req,res,next) => {
    Promo.findByIdAndRemove(req.params.promotionId)
    .then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = promotionsRouter