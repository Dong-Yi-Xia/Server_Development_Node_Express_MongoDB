const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//dishRouter is a filepath  
const dishRouter = require('./routes/dishRouter')
const promotionsRouter = require('./routes/promotionsRouter')
const leadersRouter = require('./routes/leadersRouter')

const hostname = 'localhost'
const port = 3000 

const app = express()
//Everytime you use a middleware include app.use
app.use(morgan('dev'))
app.use(bodyParser.json()) //in the req, the body is parsed into JSON

//mounting the dishRouter, Forwards any requests to the /dishes URI to our dishRouter
//1st parameter is the endpoint, 2nd parameter is the express Router
app.use('/dishes', dishRouter)
app.use('/promotions', promotionsRouter)
app.use('/leaders', leadersRouter)



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


