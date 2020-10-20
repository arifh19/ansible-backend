const redis = require('../config/redis')
const response = require('../helper/response')

const getAll = (req, res, next) => {
    redis.redisDB.get(req.originalUrl, (err, data) => {
        if (err) {
            return response(res, 500, 'Error', err)
        } else if (data !== null) {
            const results = JSON.parse(data)
            return response(res, 200, 'List Data', results)
        } else {
            next()
        }
    })
}

module.exports = getAll