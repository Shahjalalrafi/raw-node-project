// Dependencies
const http = require('http')
const {handleReqRes} = require('./helpers/handlereqres')

// app Object - module scafolding
const app = {}

// configaration
app.config = {
    port: 3000
}

// create server
app.createServer = () => {
    const server = http.createServer(handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`listenning to port ${app.config.port}`)
    })
}

// start the server
app.createServer()

