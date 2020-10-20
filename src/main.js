const express = require('express')
const routes = express.Router()
const category = require('./routes/Category')
const product = require('./routes/Product')
const history = require('./routes/History')
const user = require('./routes/User')
const auth = require("./routes/Auth")
const cors = require('cors')

routes.options('*', cors())
routes.use('/category', category)
routes.use('/product', product)
routes.use('/history', history)
routes.use('/user', user)
routes.use('/auth', auth)

module.exports = routes