require('dotenv/config')
const express = require('express')
const routes = require('./src/main')
const database = require('./src/config/Databases')
const bodyPraser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const redis = require('./src/config/redis')
const server = express()
const port = 3000
const isLogin = require('./src/middleware/validate')
const fs = require('fs')
const path = require('path')
const accessLogStream = fs.createWriteStream(path.join('./logfile', `${new Date().toISOString().substring(0, 10)}-access.log`), {
    flags: 'a'
})
server.use(bodyPraser.urlencoded({
    extended: true
}))
server.use(bodyPraser.json())

server.use(morgan('combined', {
    stream: accessLogStream
}))
server.use(routes)
server.use(cors());
server.use("/public", express.static("public"))
// server.use("/public", express.static("public"))

database.connect()
    .then((result) => {
        console.log("Database is connected")
    })
    .catch((error) => {
        console.log(`Database disconnected ${error}`)
    })

redis.redisCheck()
    .then((res) => {
        console.log(res)
    })
    .catch((error) => {
        console.log(error)
    })
server.listen(port, () => {
    console.log(`Service running on port ${port}`)
})