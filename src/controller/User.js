const model = require('../model/User')
const response = require('../helper/response')
const hashPassword = require('../helper/hash')
const {
    v4: uuidv4
} = require('uuid')
const validator = require('../helper/validator')
const redis = require('../config/redis')

const User = {}


User.all = async (req, res) => {
    try {
        const results = await model.getAll()
        let message
        if (results.length === 0) {
            message = 'No Data'
        } else {
            message = 'List Data'
        }

        const data_redis = JSON.stringify(results)
        redis.redisDB.setex(req.originalUrl, 30, data_redis)

        return response(res, 200, message, results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

User.getByUsername = async (req, res) => {
    try {
        const results = await model.getUsername(req.body.username)
        const data_redis = JSON.stringify(results)
        redis.redisDB.setex(req.originalUrl, 30, data_redis)
        return response(res, 200, message, results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

User.add = async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            role: req.body.role,
        }
        const errors = validator.addUser(data)
        if (errors) {
            return response(res, 400, 'Error', errors)
        }
        const passHash = await hashPassword(req.body.password)
        const uuid = uuidv4()
        const results = await model.add(uuid, passHash, data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 201, 'User added successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

User.edit = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            role: req.body.role,
        }
        const errors = validator.editUser(data)
        if (errors) {
            return response(res, 400, 'Error', errors)
        }
        const passHash = await hashPassword(req.body.password)
        const results = await model.edit(passHash, data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 200, 'User updated successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

User.delete = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
        }
        const errors = validator.deleteUser(data)
        if (errors) {
            return response(res, 400, 'Error', errors)
        }
        const results = await model.delete(data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 200, 'User deleted successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

module.exports = User