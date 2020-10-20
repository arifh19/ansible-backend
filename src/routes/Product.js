const express = require('express')
const upload = require("../middleware/upload")
const route = express.Router()
const controller = require('../controller/Product')
const cache = require('../middleware/cache')
const isLogin = require('../middleware/validate')
const authorize = require('../middleware/authorize')

route.get('/', isLogin, authorize.grantAccess(['admin', 'operator']), cache, controller.all)
route.post('/', isLogin, authorize.grantAccess(['admin']), upload.single('image'), controller.add)
route.put('/', isLogin, authorize.grantAccess(['admin']), upload.single('image'), controller.edit)
route.delete('/:id', isLogin, authorize.grantAccess(['admin']), controller.delete)
route.get('/search/:name', isLogin, authorize.grantAccess(['admin', 'operator']), cache, controller.searchByName)
route.get('/:id', isLogin, authorize.grantAccess(['admin', 'operator']), cache, controller.show)


// route.get('/', cache, controller.all)
// route.post('/', upload.single('image'), controller.add)
// route.put('/', upload.single('image'), controller.edit)
// route.delete('/:id', controller.delete)
// route.get('/search/:name', cache, controller.searchByName)
// route.get('/:id', cache, controller.show)
module.exports = route