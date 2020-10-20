const express = require("express")
const route = express.Router()
const controller = require('../controller/Auth')

route.post("/login", controller.login)
route.post("/refresh", controller.RefreshToken)

module.exports = route