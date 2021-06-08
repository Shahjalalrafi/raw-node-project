// dependencies
const { parseJSON, createRandomString } = require('../../helpers/utilities')
const data = require('../../lib/data')
const tokenHandler = require('./tokenHandler')

const handler = {}

handler.checkHandler = (requestProperties, callBack) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callBack)
    } else {
        callBack(405)
    }
}

handler._check = {}

handler._check.post = (requestProperties, callBack) => {
    // validate inputs
    let protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false
    
    let url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false

    let method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false

    let succesCodes = typeof requestProperties.body.succesCodes === 'object' && requestProperties.body.succesCodes instanceof Array ? requestProperties.body.succesCodes : false

    let timeOutSeconds = typeof requestProperties.body.timeOutSeconds === 'number' && requestProperties.body.timeOutSeconds % 1 == 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false

    if(protocol && url && method && succesCodes && timeOutSeconds ) {
        // verify token
        let token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false
        // lookup the user phone by reading the token
        data.read('tokens', token, (err, tokenData) => {
            if(!err && tokenData) {
                let userPhone = parseJSON(tokenData).phone
                // lookup the user data
                data.read('users', userPhone, (err2, userData) => {
                    if(!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (isTokenValid) => {
                            if(isTokenValid) {
                                let userObject = parseJSON(userData)
                                let userChecks = typeof userObject.checks == 'object' && userObject.checks instanceof Array ? userObject.checks : []
                                if(userChecks < 5) {
                                    let checkId = createRandomString(20)
                                    const checkObject = {
                                        id: checkId,
                                        protocol,
                                        userPhone,
                                        url,
                                        method,
                                        succesCodes,
                                        timeOutSeconds
                                    }
                                    // save the object
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if(!err) {
                                            // add check id to user object
                                            userObject.checks = userChecks
                                            userObject.checks.push(checkId)
                                            // save the new user data
                                            data.update('users', userPhone, userObject,(err4) => {
                                                if(!err4) {
                                                    // return the data about new checks
                                                    callBack(200, checkObject)
                                                }else {
                                                    callBack(500, {
                                                        error: 'there was a problem in the server side'
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }else {
                                    callBack(403,{
                                        Error: 'user has already check max limit'
                                    })
                                }
                            }else {
                                callBack(403, {
                                    error: 'authentication problem'
                                })
                            }
                        })
                    }else {
                        callBack(403, {
                            error: 'user not found!'
                        })
                    }
                })
            }else {
                callBack(403, {
                    error: 'authentication problem'
                })
            }
        })

    }else {
        callBack(400, {
            error: "you have a problem in your request"
        })
    }
    
}

handler._check.get = (requestProperties, callBack) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false

    if(id) {
        // look for data
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData) {
                let token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false

                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (isTokenValid) => {
                    if(isTokenValid) {
                        callBack(200, parseJSON(checkData))
                    }else {
                        callBack(403, {
                            error: 'authenticationo failure'
                        })
                    }
                })
            }
        })
    }else {
        callBack(403, {
            error: 'can not find something like id'
        })
    }
}


handler._check.put = (requestProperties, callBack) => {
    // validate inputs
    let protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false
    
    let url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false

    let method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false

    let succesCodes = typeof requestProperties.body.succesCodes === 'object' && requestProperties.body.succesCodes instanceof Array ? requestProperties.body.succesCodes : false

    let timeOutSeconds = typeof requestProperties.body.timeOutSeconds === 'number' && requestProperties.body.timeOutSeconds % 1 == 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false

    const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 21 ? requestProperties.body.id : false

    if(id) {
        if(protocol || url || method || succesCodes || timeOutSeconds ) {
            data.read('checks', id, (err1, checkData) => {
                if(!err1 && checkData ) {
                    const checkObject = parseJSON(checkData)
                    let token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false
                    tokenHandler._token.verify(token, checkObject.userPhone, (isTokenValid) => {
                        if(isTokenValid) {
                            if(protocol) {
                                checkObject.protocol = protocol
                            }
                            if(url) {
                                checkObject.url = url
                            }
                            if(method) {
                                checkObject.method = method
                            }
                            if(succesCodes) {
                                checkObject.succesCodes = succesCodes
                            }
                            if(timeOutSeconds) {
                                checkObject.timeOutSeconds = timeOutSeconds
                            }
                            // store data to checkObejct
                            data.update('checks', id, checkObject, (err3) => {
                                if(!err3) {
                                    callBack(200, checkObject)
                                }else {
                                    callBack(403, {
                                        error: 'there was a problem in server side'
                                    })
                                }
                            })
                        }else {
                            callBack(403, {
                                error: 'authentication error'
                            })
                        }
                    })
                }else {
                    callBack(403, {
                        error: 'there was a problem in server side'
                    })
                }
            })
        }else {
            callBack(403, {
                error: 'you must provide at least one field to update'
            })
        }
    }else {
        callBack(403, {
            error: 'id can not find'
        })
    }
}


handler._check.delete = (requestProperties, callBack) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false

    if(id) {
        // look for data
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData) {
                let token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false

                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (isTokenValid) => {
                    if(isTokenValid) {
                        // delete the check data
                        data.delete('checks', id, (err1) => {
                            if(!err1) {
                                data.read('users', parseJSON(checkData).userPhone, (err3, userData) => {
                                    let userObject = parseJSON(userData)
                                    if(!err2 && userData) {
                                        let userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : []

                                        let checkPosition = userChecks.indexOf(id)
                                        if(checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1)
                                            userObject.checks = userChecks
                                            data.update('users', userObject.phone, userObject, (err3) => {
                                                if(!err3) {
                                                    callBack(200)
                                                }else {
                                                    callBack(404,{
                                                        error: 'there was a problem in server side'
                                                    })
                                                }
                                            })
                                        }else {
                                            callBack(400, {
                                                error: 'the check id that you are trying to remove is not found in user!'
                                            })
                                        }
                                    }else {
                                        callBack(500, {
                                            error: 'there was a problem in server side'
                                        })
                                    }
                                })
                            }else{
                                callBack(500, {
                                    error: 'there was a problem in server side'
                                })
                            }
                        })
                    }else {
                        callBack(403, {
                            error: 'authenticationo failure'
                        })
                    }
                })
            }
        })
    }else {
        callBack(403, {
            error: 'can not find something like id'
        })
    }
}

module.exports = handler
