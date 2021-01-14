const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const hostname = 'localhost'
const port = 3000 

const app = express()
//Everytime you use a middleware include app.use
app.use(morgan('dev'))
app.use(bodyParser.json()) //in the req, the body is parsed into JSON

app.all('/dishes', (req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
//app.all get called first, the next() will look for the next one with the dishes endpoint
//the req,res in the app.all will be pass down into the next get/post/put/delete
//when make a modify (req,res) in the app.all the next get/post/put/delete will also be modified
app.get('/dishes', (req,res,next) => {
    res.end('Will send all the dishes to you!')
})

app.post('/dishes', (req,res,next) => {
    res.end(`Will add a new dish: ${req.body.name} with details: ${req.body.description}`)
})

app.put('/dishes', (req,res,next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /dishes`)
})

app.delete('/dishes', (req,res,next) => {
    res.end('Deleting all the dishes!!!')
})

//with :dishId
app.get('/dishes/:dishId', (req,res,next) => {
    res.end(`Will send details of the dish: ${req.params.dishId} to you!`)
})

app.post('/dishes/:dishId', (req,res,next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
})

app.put('/dishes/:dishId', (req,res,next) => {
    //res.write will add a line to the reply message. 
    // \n will add a new line at the end
    res.write(`Updating the dish: ${req.params.dishId} \n`)
    res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`)
})

app.delete('/dishes/:dishId', (req,res,next) => {
    res.end(`Deleting dish: ${req.params.dishId}`)
})


//__dirname => rootfolder
app.use(express.static(__dirname+ '/public'))

//buildin function .use() take 3 parameter. 
// Next is optional, Next allow to use more middleware
app.use((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content_Type', 'text/html')
    res.end('<html><body><h1>This is an Express Server</h1></body></html>')
})

const server = http.createServer(app)

server.listen(port, hostname, ()=> {
    console.log(`Server running at http://${hostname}:${port}`)
})


