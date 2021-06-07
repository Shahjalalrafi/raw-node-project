// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
// const {environments} = require('./helpers/environment')
const data = require('./lib/data')

// app Object - module scafolding
const app = {}

// configaration
app.config = {
    port: 3000
}


// data.create('test', 'newFile', {name: 'Bangladesh', language: 'bangla'}, (err) => {
//     console.log('error was', err)
// })

// data.read('test', 'newFile', (err, data) => {
//     console.log(err, data)
// } )

// data.update('test', 'newFile', {name: 'England', language: 'English'}, (err) => {
//     console.log(err)
// })

// data.delete('test', 'newFile', (err) => {
//     console.log(err)
// })


// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();

