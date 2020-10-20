const express = require('express')
const route = express.Router()
const controller = require('../controller/History')
const isLogin = require('../middleware/validate')
const authorize = require('../middleware/authorize')
const cache = require('../middleware/cache')
const upload = require("../middleware/upload")

route.get('/', isLogin, authorize.grantAccess(['admin']), cache, controller.all)
route.post('/', isLogin, authorize.grantAccess(['admin', 'operator']), upload.none(), controller.add)
route.put('/', isLogin, authorize.grantAccess(['admin']), controller.edit)
route.delete('/', isLogin, authorize.grantAccess(['admin']), controller.delete)


// route.get('/', cache, controller.all)
// route.post('/', controller.add)
// route.put('/', controller.edit)
// route.delete('/', controller.delete)

module.exports = route