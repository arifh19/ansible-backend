const response = require("../helper/response")
const jwt = require("jsonwebtoken")

const isLogin = (req, res, next) => {
    if (!req.headers.authorization) {
        const result = {
            msg: "Login dulu",
        }
        return response(res, 401, 'Error', result)
    }
    const access_token = req.headers.authorization.split(' ')[1];

    jwt.verify(access_token, process.env.JWT_KEYS, (err, decode) => {
        if (err) {
            return response(res, 401, 'Error', err)
        } else if (decode.type_token === 'access') {
            next()
        } else {
            let message = {
                message: "Token has wrong type"
            }
            return response(res, 401, 'Error', message)
        }

    })
}

module.exports = isLogin