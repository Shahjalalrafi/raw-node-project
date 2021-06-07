const crypto = require('crypto')

const utilities = {}

utilities.parseJSON = (jsonString) => {
    let outPut

    try{
        outPut = JSON.parse(jsonString)
    }catch{
        outPut = {}
    }
    return outPut
}

utilities.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0) {
        let hash = crypto
        .createHmac('shajalal', '1235')
        .update(str)
        .digest('hex')
        return hash
    }else {
        return false
    }
}

module.exports = utilities