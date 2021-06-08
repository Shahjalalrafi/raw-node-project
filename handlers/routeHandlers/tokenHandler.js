// dependencies
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities')
const data = require('../../lib/data')

const handler = {}

handler.tokenHandler = (requestProperties, callBack) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callBack)
    } else {
        callBack(405)
    }
}

handler._token = {}

handler._token.post = (requestProperties, callBack) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.passwor : false

    if(phone && !password) {
        data.read('users', phone, (err1, userData) => {
            let ourPhone = phone
            if(ourPhone === parseJSON(userData).phone) {

                const tokenId = createRandomString(20)
                const expires = Date.now() * 60 * 60 * 1000
                let tokenObject = {
                    phone,
                    expires,
                    id: tokenId
                }

                // store the token
                data.create('tokens',tokenId, tokenObject,(err2) => {
                    if(!err2) {
                        callBack(200, tokenObject)
                    }else {
                        callBack(404, {
                            Error: "there was a problem in server side"
                        })
                    }
                })
            }
        })
    }else {
        callBack(404, {
            Error: "invalid phone or password"
        })
    }
}

handler._token.get = (requestProperties, callBack) => {
    // check if id is valid
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false

    if(id) {
        // looking the user
        data.read('tokens', id, (err, tokenData) => {
            const token = {...parseJSON(tokenData)}
            if(!err && token) {
                callBack(200, token)
            }else {
                callBack(404, {
                    error: 'requested user was not found!'
                })
            }
        })
    }else {
        callBack(400, {
            error: 'this is invalid..can not found it'
        })
    }
}

handler._token.put = (requestProperties, callBack) => {
    const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 21 ? requestProperties.body.id : false

    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend == true ? true : false

    if(id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            let tokenObject = parseJSON(tokenData)
            if(tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() * 60 * 60 * 1000
                // store the update token 
                data.update('tokens', id, tokenObject,(err2) => {
                    if(!err) {
                        callBack(200)
                    }else {
                        callBack(500, {
                            error: 'there was a problem in server side'
                        })
                    }
                })
            }else {
                callBack(404, {
                    error: 'token already exprire'
                })
            }
        })
    }else {
        callBack(400, {
            error: 'invalid user..'
        })
    }

}

handler._token.delete = (requestProperties, callBack) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false

    if(id) {
        // looking for user
        data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData) {
                data.delete('tokens', id, (err) => {
                    if(!err) {
                        callBack(200, {
                            message: 'user deleted succesfully'
                        })
                    }else {
                        callBack(404, {
                            error: 'there was a server side error'
                        })
                    }
                })
            }else {
                callBack(404, {
                    error: 'can not find your user'
                })
            }
        })
    }else {
        callBack(404, {
            error: 'there is a problem in your request'
        })
    }
}

handler._token.verify = (id, phone, callBack) => {
    data.read('tokens', id, (err, tokenData) => {
        if(!err && tokenData) {
            if(parseJSON(tokenData).phone == phone && parseJSON(tokenData).expires > Date.now()) {
                callBack(true)
            }else {
                callBack(false)
            }
        }else {
            callBack(false)
        }
    })
}

module.exports = handler