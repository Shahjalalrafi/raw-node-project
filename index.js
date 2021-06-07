// Dependencies
const http = require('http')
const {handleReqRes} = require('./helpers/handlereqres')
// const {environments} = require('./helpers/environment')
const data = require('./lib/data')

// app Object - module scafolding
const app = {}

// configaration
app.config = {
    port: 3000
}


data.create('test', 'newFile', {name: 'Bangladesh', language: 'bangla'}, (err) => {
    console.log('error was', err)
})

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes)
    server.listen(app.config.port, () => {
        console.log(`listenning to port ${app.config.port}`)
    })
}

app.hadleReqRes = handleReqRes

// start the server
app.createServer()

