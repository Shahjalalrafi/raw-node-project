
const { checkHandler } = require('./handlers/routeHandlers/checksHandler')
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler')
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler')
const { userHandler } = require('./handlers/routeHandlers/userHandler')

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    checks: checkHandler
}

module.exports = routes