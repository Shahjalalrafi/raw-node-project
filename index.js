// Dependencies
const http = require('http')

// app Object - module scafolding
const app = {}

// configaration
app.config = {
    port : 3000
}

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`listenning to port ${app.config.port}`)
    })
}

// handle request and response
app.handleReqRes = (req, res) => {
    res.end('hello world')
}

// start the server
app.createServer()
