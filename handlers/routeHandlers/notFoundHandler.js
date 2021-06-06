const handler = {}

handler.notFoundHandler = (requestProperties, callBack) => {
    callBack(400, {
        message: 'page not found here'
    })
}

module.exports = handler