// dependencies
const { hash, parseJSON } = require('../../helpers/utilities')
const data = require('../../lib/data')
const tokenHandler = require('./tokenHandler')

const handler = {}

handler.userHandler = (requestProperties, callBack) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callBack)
    } else {
        callBack(405)
    }
}

handler._user = {}

handler._user.post = (requestProperties, callBack) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.passwor : false

    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
        ? requestProperties.body.tosAgreement
        : false;

    if (firstName && lastName && phone && tosAgreement) {
        //make use data dosen't exists
        data.read('users', phone, (err) => {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                }
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callBack(200, {
                            'message': 'user created succesfully'
                        })
                    } else {
                        callBack(405, {
                            'message': 'user already exists'
                        })
                    }
                })
            } else {
                callBack(405, {
                    'error': 'there was a problem in server side'
                })
            }
        })
    } else {
        callBack(400, {
            error: 'you have a problem in your request'
        })
    }
}

handler._user.get = (requestProperties, callBack) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false

    if (phone) {
        // verify token
        let token = typeof requestProperties.headerObject === 'string' ? requestProperties.headerObject : false

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (!tokenId) {
                // looking the user
                data.read('users', phone, (err, u) => {
                    const user = { ...parseJSON(u) }
                    if (!err && user) {
                        delete user.password
                        callBack(200, user)
                    } else {
                        callBack(404, {
                            error: 'requested user was not found!'
                        })
                    }
                })
            } else {
                callBack(404, {
                    error: 'can not find your token id'
                })
            }
        })

    } else {
        callBack(500, {
            error: 'your phone number invalid'
        })
    }
}


handler._user.put = (requestProperties, callBack) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.passwor : false

    if (phone) {
        if (firstName || lastName || phone) {
            // verify token
            let token = typeof requestProperties.headerObject === 'string' ? requestProperties.headerObject : false

            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (!tokenId) {
                    // looking for a user
                    data.read('users', phone, (err, uData) => {
                        const userData = { ...parseJSON(uData) }
                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName
                            }
                            if (lastName) {
                                userData.lastName = lastName
                            }
                            if (password) {
                                userData.passwor = hash(password)
                            }

                            data.update('users', phone, userData, (err) => {
                                if (!err) {
                                    callBack(200, {
                                        message: 'user update succesfully..'
                                    })
                                } else {
                                    callBack(404, {
                                        error: 'is there has a problem in server side'
                                    })
                                }
                            })
                        } else {
                            callBack(404, {
                                error: 'you have a problem in your request!!..'
                            })
                        }
                    })
                } else {
                    callBack(404, {
                        error: 'can not find your token id'
                    })
                }
            })

        } else {
            callBack(404, {
                error: 'something went wrong'
            })
        }
    } else {
        callBack(405, {
            error: 'invalid phone number..please try again..'
        })
    }
}


handler._user.delete = (requestProperties, callBack) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false

    if (phone) {
        // verify token
        let token = typeof requestProperties.headerObject === 'string' ? requestProperties.headerObject : false

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (!tokenId) {
                // looking for user
                data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        data.delete('users', phone, (err) => {
                            if (!err) {
                                callBack(200, {
                                    message: 'user deleted succesfully'
                                })
                            } else {
                                callBack(404, {
                                    error: 'there was a server side error'
                                })
                            }
                        })
                    } else {
                        callBack(404, {
                            error: 'can not find your user'
                        })
                    }
                })
            } else {
                callBack(404, {
                    error: 'can not find your token id'
                })
            }
        })

    } else {
        callBack(404, {
            error: 'there is a problem in your request'
        })
    }
}

module.exports = handler