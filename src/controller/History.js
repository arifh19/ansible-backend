const model = require('../model/History')
const response = require('../helper/response')
const redis = require('../config/redis')
const validator = require('../helper/validator')
const History = {}

History.all = async (req, res) => {
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

History.add = async (req, res) => {
    console.log(req.body)
    try {
        const data = {
            invoices: req.body.invoices,
            cashier: req.body.cashier,
            date: req.body.date,
            orders: req.body.orders,
            amount: req.body.amount
        };
        const errors = validator.addHistory(data)

        if (errors) {
            return response(res, 400, 'Error', errors)
        }
        const results = await model.add(data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 201, 'History added successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

History.edit = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            invoices: req.body.invoices,
            cashier: req.body.cashier,
            date: req.body.date,
            orders: req.body.orders,
            amount: req.body.amount
        };
        const errors = validator.editHistory(data)

        if (errors) {
            return response(res, 400, 'Error', errors)
        }
        const results = await model.edit(data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 200, 'History updated successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

History.delete = async (req, res) => {
    try {
        const data = {
            id: req.body.id,
        };
        const errors = validator.deleteHistory(data)

        if (errors) {
            return response(res, 400, 'Error', errors)
        }
        const results = await model.delete(data)
        redis.redisDB.del(req.originalUrl)
        return response(res, 200, 'History deleted successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}
module.exports = History