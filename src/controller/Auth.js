const model = require("../model/User")
const response = require("../helper/response")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const jwtDecode = require("jwt-decode")
const validator = require("../helper/validator")

class Auth {
    login = async (req, res) => {
        try {
            const data = {
                username: req.body.username,
                password: req.body.password,
            }
            const errors = validator.Login(data)
            if (errors) {
                return response(res, 400, 'Error', errors)
            }

            const userDB = await model.getByUsername(req.body.username)
            if (userDB.length <= 0) {
                return response(res, 400, 'Error', "Username tidak terdaftar")
            }

            const passwordReq = req.body.password
            const check = await bcrypt.compare(passwordReq, userDB[0].password)

            if (check) {
                const accessToken = await this.setAccessToken(userDB[0])
                const refreshToken = await this.setRefreshToken(userDB[0])
                const result = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    msg: "Token created, login success",
                }
                return response(res, 200, 'Login successfully', result)
            } else {
                return response(res, 200, 'Login is failed', {})
            }
        } catch (error) {
            return response(res, 500, 'Error', error)
        }
    }

    RefreshToken = async (req, res) => {
        try {
            const {
                refresh_token
            } = req.body
            console.log(req.body)
            if (!refresh_token) {
                const result = {
                    msg: "Refresh Token is required",
                }
                return response(res, 401, 'Error', result)
            }

            jwt.verify(refresh_token, process.env.JWT_KEYS, (err, decode) => {
                if (err) {
                    return response(res, 401, 'Error', err)
                } else if (decode.type_token !== 'refresh') {
                    let message = {
                        message: "Token has wrong type"
                    }
                    return response(res, 401, 'Error', message)
                }
            })
            const {
                uuid
            } = jwtDecode(refresh_token)
            const userDB = await model.getByUuid(uuid)
            const accessToken = await this.setAccessToken(userDB[0])

            const result = {
                access_token: accessToken,
                msg: "Token created",
            }
            return response(res, 200, 'Refresh token successfully', result)

        } catch (error) {
            return response(res, 500, 'Error', error)
        }
    }

    setAccessToken = async (user) => {
        try {
            const payloadAccess = {
                type_token: 'access',
                uuid: user.uuid,
            }
            const accessToken = jwt.sign(payloadAccess, process.env.JWT_KEYS, {
                expiresIn: 60 * 60
            })
            return accessToken
        } catch (error) {
            throw error
        }
    }

    setRefreshToken = async (user) => {
        try {
            const payloadRefresh = {
                type_token: 'refresh',
                uuid: user.uuid,
            }
            const refreshToken = jwt.sign(payloadRefresh, process.env.JWT_KEYS, {
                expiresIn: '24h'
            })
            return refreshToken
        } catch (error) {
            throw error
        }
    }
}

module.exports = new Auth()