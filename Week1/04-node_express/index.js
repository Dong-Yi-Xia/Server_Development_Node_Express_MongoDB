const express = require('express')
const http = require('http')
const morgan = require('morgan')

const hostname = 'localhost'
const port = 3000 

const app = express()
app.use(morgan('dev'))

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


