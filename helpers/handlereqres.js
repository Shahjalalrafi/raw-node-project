const url = require('url')
const { StringDecoder } = require('string_decoder')
const routes = require('../routes')
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler')
const { parseJSON } = require('./utilities')

const handler = {}

// handle request and response
handler.handleReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true)
    const path = parseUrl.pathname
    const trimedPath = path.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase()
    const queryStringObject = parseUrl.query
    const headerObject = req.headers

    const requestProperties = {
        parseUrl,
        path,
        trimedPath,
        method,
        queryStringObject,
        headerObject
    }

    const decoder = new StringDecoder('utf-8')
    let realData = ''

    const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler



    req.on('data', (buffer) => {
        realData += decoder.write(buffer)
    })

    req.on('end', () => {
        realData += decoder.end()

        requestProperties.body = parseJSON(realData)

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500
            payload = typeof payload === 'object' ? payload : {}

            const payloadString = JSON.stringify(payload)

            res.setHeader('content-type','application/json')
            res.writeHead(statusCode)
            res.end(payloadString)
        })
    })
}

module.exports = handler

