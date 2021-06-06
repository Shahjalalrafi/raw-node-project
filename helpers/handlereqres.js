const url = require('url')
const {StringDecoder} = require('string_decoder')
const routes = require('../routes')
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler')

const handler = {}

// handle request and response
handler.handleReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true)
    const path = parseUrl.pathname
    const trimedPath = path.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase()
    const queryStringObject = parseUrl.query
    const headObject = req.headers

    const requestProperties = {
        parseUrl,
        path,
        trimedPath,
        method,
        queryStringObject,
        headObject
    }

    const decoder = new StringDecoder('utf-8')
    let realData = ''

    const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler

    chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode  === 'number' ? statusCode : 500
        payload = typeof payload === 'object' ? payload : {}

        const payloadString = JSON.stringify(payload)

        res.writeHead(statusCode)
        res.end(payloadString)
    })

    req.on('data', (buffer) => {
        realData += decoder.write(buffer)
    })

    req.on('end', () => {
        realData += decoder.end()
        console.log(realData)

        res.end('hello world')
    })

}

module.exports = handler