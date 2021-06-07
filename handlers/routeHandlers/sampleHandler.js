
const handler = {}

handler.sampleHandler = (requestProperties, callBack) => {
    // console.log(requestProperties)
    callBack(200, {
        message: 'our sample handler'
    })
}

module.exports = handler