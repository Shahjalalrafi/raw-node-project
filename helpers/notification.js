const https = require('https')
const querystring = require('querystring')

const notification = {}

const twillioDetails = {
    fromPhone: "+1500555006",
    accountSid : "ACb32d411ad7e886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67"
}

notification.sendTwillioSms = (phone, msg, callBack) => {
    const userPhone = typeof(phone == 'string') && phone.trim().length == 11 ? phone.trim() : false

    const userMsg = typeof(msg === 'string') && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

    if(userPhone && userMsg) {
        // configure the request payload
        const payload = {
            form: twillioDetails.fromPhone,
            to: `+88${userPhone}`,
            msg: userMsg
        }
        // stringify the payload
        const stringifyPayload = querystring.stringify(payload)
        // configure the request details
        const reqDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twillioDetails.accountSid}/Messages.json`,
            auth: `${twillioDetails.accountSid}:${twillioDetails.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }

        const req = https.request(reqDetails, (res) => {
            // get the request details
            const statusCode = res.statusCode
            if(statusCode === 200 && statusCode === 201) {
                callBack(false)
            }else {
                callBack(`Status code returned was ${statusCode}`);
            }
        })

        req.on('error', (e) => {
            callBack(e)
        })
        req.write(stringifyPayload)
        req.end()
    }else {
        callback('Given parameters were missing or invalid!');
    }
}

module.exports = notification