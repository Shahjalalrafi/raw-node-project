// dependencies
const { hash } = require('../../helpers/utilities')
const data = require('../../lib/data')

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

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length > 10 ? requestProperties.body.phone : false

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.passwor : false

    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' &&
    requestProperties.body.tosAgreement
        ? requestProperties.body.tosAgreement
        : false;

    if(firstName && lastName && phone && tosAgreement) {
    //make use data dosen't exists
    data.read('users', phone, (err) => {
        if(err) {
            let userObject = {
                firstName,
                lastName,
                phone,
                password: hash(password),
                tosAgreement
            }
            // store the user to db
            data.create('users', phone, userObject, (err2) => {
                if(!err2) {
                    callBack(200, {
                        'message': 'user created succesfully'
                    })
                }else {
                    callBack(405, {
                        'message': 'user already exists'
                    })
                }
            })
        }else {
            callBack(405, {
                'error': 'there was a problem in server side'
            })
        }
    }) 
    }else {
        callBack(400, {
            error: 'you have a problem in your request'
        })
    }
}

handler._user.get = (requestProperties, callBack) => {
    callBack(200)
}
handler._user.put = (requestProperties, callBack) => {

}
handler._user.delete = (requestProperties, callBack) => {

}

module.exports = handler