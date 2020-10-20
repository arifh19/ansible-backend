const express = require('express')
const route = express.Router()
const controller = require('../controller/User')
const isLogin = require('../middleware/validate')
const authorize = require('../middleware/authorize')

route.get('/', isLogin, authorize.grantAccess(['admin']), controller.all)
route.post('/', controller.add)
route.put('/', isLogin, authorize.grantAccess(['admin']), controller.edit)
route.delete('/', isLogin, authorize.grantAccess(['admin']), controller.delete)

module.exports = route