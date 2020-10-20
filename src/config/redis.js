const redis = require('redis')

class Redis {
    constructor() {
        this.redisDB = redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        })
    }

    redisCheck() {
        return new Promise((resolve, reject) => {
            this.redisDB.get("testkey", (err, res) => {
                if (err) {
                    reject('Redis is not connected')
                } else if (res === null || res === "OK") {
                    resolve("Redis is connected")
                }
            })
        })
    }

}

module.exports = new Redis()