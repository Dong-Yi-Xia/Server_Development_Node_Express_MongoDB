const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Leader = require('../models/leaders')

const leadersRouter = express.Router()
leadersRouter.use(bodyParser.json())

leadersRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Leader.find({})
    .then(leaders => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leaders)
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Leader.create(req.body)
    .then(leader => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
    }, err => next(err))
    .catch(err => next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /leaders`)
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Leader.remove({})
    .then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    }, err => next(err))
    .catch(err => next(err))
})


////////////////////////////////////////////
////////////////////////////////////////////

leadersRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
.get(cors.cors, (req,res,next) => {
    Leader.findById(req.params.leaderId)
    .then(leader => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /leaders ${req.params.leaderId}`)
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Leader.findByIdAndUpdate(req.params.leaderId, 
        {$set: req.body}, 
        {new: true}
    )
    .then(leader => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
    }, err => next(err))
    .catch(err => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Leader.findByIdAndRemove(req.params.leaderId)
    .then(result => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = leadersRouter