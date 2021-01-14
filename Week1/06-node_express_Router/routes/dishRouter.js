const express = require('express')
const bodyParser = require('body-parser')

const dishRouter = express.Router()
dishRouter.use(bodyParser.json())

// Writing it this way is the long way
// dishRouter.get('/', (req,res,next) => {
//     res.end('Will send all the dishes to you!')
// }))
// dishRouter.get('/:dishId', (req,res,next) => {
//     res.end(`Will send details of the dish: ${req.params.dishId} to you!`)
// })) 

// So this route actually handles `/dishes` because it's the root route 
// when a request to /dishes is forwarded to our router.
dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})

.get( (req,res,next) => {
    res.end('Will send all the dishes to you!')
})

.post((req,res,next) => {
    res.end(`Will add a new dish: ${req.body.name} with details: ${req.body.description}`)
})

.put((req,res,next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /dishes`)
})

.delete((req,res,next) => {
    res.end('Deleting all the dishes!!!')
})

//with :dishId
dishRouter.route('/:dishId')
.all((req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})

.get((req,res,next) => {
    res.end(`Will send details of the dish: ${req.params.dishId} to you!`)
})

.post((req,res,next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
})

.put((req,res,next) => {
    res.write(`Updating the dish: ${req.params.dishId} \n`)
    res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`)
})

.delete((req,res,next) => {
    res.end(`Deleting dish: ${req.params.dishId}`)
})



module.exports = dishRouter