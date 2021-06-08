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

utilities.createRandomString = (strlength) => {
    let length = strlength
    length = typeof length === 'number' && length > 0 ? strlength : false
    if(length) {
        let possibleCharacter = 'abcdefghijklmnopqrstuvwxyz1234567890'
        let outPut = ''
        for(let i = 0; i<= length; i++) {
            let randomCharacter = possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length))
            outPut += randomCharacter
        }
        return outPut
    }
}

module.exports = utilities