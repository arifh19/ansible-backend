const model = require('../model/Category')
const response = require('../helper/response')
const redis = require('../config/redis')
const validator = require('../helper/validator')
const Category = {}

Category.all = async (req, res) => {
    try {
        const data = await model.getAll()

        let message
        if (data.length === 0) {
            message = 'No Data'
        } else {
            message = 'List Data'
        }
        const data_redis = JSON.stringify(data)
        redis.redisDB.setex(req.originalUrl, 30, data_redis)
        return response(res, 200, message, data)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

Category.add = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
        }
        const errors = validator.addCategory(data)
        if (errors) {
            return response(res, 400, 'Error', errors)
        }

        const results = await model.add(data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 201, 'Category added successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

Category.edit = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            name: req.body.name,
        }
        const errors = validator.editCategory(data)
        if (errors) {
            return response(res, 400, 'Error', errors)
        }
        const results = await model.edit(data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 200, 'Category updated successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

Category.delete = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
        }
        const errors = validate.deleteCategory(data)
        if (errors) {
            return response(res, 400, 'Error', errors)
        }
        const results = await model.delete(data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 200, 'Category deleted successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

module.exports = Category