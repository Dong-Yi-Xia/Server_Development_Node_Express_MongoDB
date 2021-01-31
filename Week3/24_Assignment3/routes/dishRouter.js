const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')

//require the dishes model
const Dishes = require('../models/dishes')


const dishRouter = express.Router()
dishRouter.use(bodyParser.json())
//the body of the request is parse into the format of JSON

//acesscing the dishes model
dishRouter.route('/')
.get( (req,res,next) => {
    Dishes.find({})
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
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log(`Dish Created ${dish}`)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
    }, (err) => next(err))
    .catch((err) => next(err))
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /dishes`)
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
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
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
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

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
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

//:dishId/comments  

dishRouter.route('/:dishId/comments')
.get( (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish !== null){
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments)
        }else{
            err = new Error(`Dish ${req.params.dishId} not found!`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish !== null){
            //comments.author ref automatically created by the server side
            //valid user therefore we get the req.user._id
            req.body.author = req.user._id 
            dish.comments.push(req.body)
            dish.save()
            .then((dish) => {
                 Dishes.findById(dish._id)
                    .populate('comments.author')
                     .then(dish => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)
                    })
            }, (err) => next(err))
        }else{
            err = new Error(`Dish ${req.params.dishId} not found!`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /dishes/${req.params.dishId}/comments`)
})

.delete(authenticate.verifyUser, (req,res,next) => {
     Dishes.findById(req.params.dishId)
     .then((dish) => {
        if(dish !== null){
            for(let i = (dish.comments.length-1); i >= 0; i--){
                dish.comments.id(dish.comments[i]._id).remove()
            }
            // let i = dish.comments.length-1
            // while(i-- >= 0){
            //     dish.comments.pop()
            // }
            dish.save()
            .then(dish => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            }, (err) => next(err))
        }
        else{
            err = new Error(`Dish ${req.params.dishId} not found!`)
            err.status = 404
            return next(err)
        }
    },(err) => next(err))
    .catch((err) => next(err))
})


//////////////////////////////////////////

//:dishId/comments/:commentsId

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){ 
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments.id(req.params.commentId))
        }
        else if (dish === null){ 
            err = new Error(`Dish ${req.params.dishId} not found!`)
            err.status = 404
            return next(err)
        } 
        else {
            err = new Error(`Comment ${req.params.commentId} not found!`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`)
})

.put(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish !== null && dish.comments.id(req.params.commentId) !== null && 
        String(dish.comments.id(req.params.commentId).author) == String(req.user._id)){ 
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment
            }
            dish.save()
            .then((dish) => {
                 Dishes.findById(dish._id)
                 .populate('comments.author')
                 .then(dish => {
                     res.statusCode = 200
                     res.setHeader('Content-Type', 'application/json')
                     res.json(dish)
                 })
            }, (err) => next(err))
        }else if (dish === null){
            err = new Error(`Dish ${req.params.dishId} not found!`)
            err.status = 404
            return next(err)
        } else if(dish.comments.id(req.params.commentId) === null){
            err = new Error(`Comment ${req.params.commentId} not found!`)
            err.status = 404
            return next(err)
        } else {
            err = new Error(`Can not modify/delete someone elses comment`)
            err.status = 404
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish !== null && dish.comments.id(req.params.commentId) !== null && 
        String(dish.comments.id(req.params.commentId).author) == String(req.user._id)){ 
            dish.comments.id(req.params.commentId).remove()         
            dish.save()
           .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then(dish => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish)
                })
           }, (err) => next(err))
        }
        else if (dish === null){
            err = new Error(`Dish ${req.params.dishId} not found!`)
            err.status = 404
            return next(err)
        } 
        else if(dish.comments.id(req.params.commentId) === null){
            err = new Error(`Comment ${req.params.commentId} not found!`)
            err.status = 404
            return next(err)
        } else {
            err = new Error(`Can not modify/delete someone elses comment`)
            err.status = 404
            return next(err)
        }
   },(err) => next(err))
   .catch((err) => next(err))
})


module.exports = dishRouter


