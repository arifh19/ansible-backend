const jwtDecode = require("jwt-decode")
const response = require("../helper/response")
const model = require('../model/User')

module.exports.grantAccess = (roles) => {
    return async (req, res, next) => {
        try {
            const {
                uuid
            } = jwtDecode(req.headers.authorization.split(' ')[1])
            const user = await model.getByUuid(uuid)
            let isValid = false
            roles.map((r) => {
                if (r === user[0].role) {
                    isValid = true
                }
            })
            if (isValid) {
                next();
            } else {
                return response(res, 401, 'Access is not permitted', {})
            }
        } catch (error) {
            return response(res, 500, 'Error', error)
        }
    }
}