// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// app Object - module scafolding
const app = {}

// configaration
app.config = {
    port: 3000
}



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

// phone= +1500555006
// accountsid= "ACb32d411ad7e886aac54c665d25e5c5d"
// authToken= "9455e3eb3109edc12e3d8c92768f7a67"