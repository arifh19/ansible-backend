const express = require('express')
const route = express.Router()
const controller = require('../controller/Category')
const cache = require('../middleware/cache')
const authorize = require('../middleware/authorize')
const isLogin = require('../middleware/validate')

route.get('/', isLogin, authorize.grantAccess(['admin', 'operator']), cache, controller.all)
route.post('/', isLogin, authorize.grantAccess(['admin']), controller.add)
route.put('/', isLogin, authorize.grantAccess(['admin']), controller.edit)
route.delete('/', isLogin, authorize.grantAccess(['admin']), controller.delete)


// route.get('/', cache, controller.all)
// route.post('/', controller.add)
// route.put('/', controller.edit)
// route.delete('/', controller.delete)

module.exports = route