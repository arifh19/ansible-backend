const model = require('../model/Product')
const response = require('../helper/response')
const redis = require('../config/redis')
const validator = require('../helper/validator');
const fs = require('fs')

const Product = {}

Product.all = async (req, res) => {
    try {
        let column
        let sort
        if (req.query.column === 'category') {
            column = 'T2.name'
            sort = req.query.sort
        } else if (Object.keys(req.query).length === 2) {
            column = `T1.${req.query.column}`
            sort = req.query.sort
        } else {
            column = 'id'
            sort = 'DESC'
        }

        const results = await model.getAll(column, sort)
        const data_redis = JSON.stringify(results)
        redis.redisDB.setex(req.originalUrl, 30, data_redis)

        let message
        if (results.length === 0) {
            message = 'No Data'
        } else {
            message = 'List Data'
        }
        return response(res, 200, message, results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

Product.show = async (req, res) => {
    try {
        const id = req.params.id
        const results = await model.get(id)
        let message
        if (results.length === 0) {
            message = 'No Data'
        } else {
            message = 'Data is found'
        }
        const data_redis = JSON.stringify(results)
        redis.redisDB.setex(req.originalUrl, 30, data_redis)
        return response(res, 200, message, results)

    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

Product.add = async (req, res) => {
    try {
        if (req.file === undefined) {
            let errors = {
                errors: {
                    image: [
                        "The image field is required."
                    ]
                }
            }
            return response(res, 400, 'Error', errors)
        }
        const data = {
            name: req.body.name,
            image: req.file.filename,
            price: req.body.price,
            stock: req.body.stock,
            category_id: req.body.category_id
        };

        const errors = validator.addProduct(data)
        if (errors) {
            fs.unlinkSync(req.file.path)
            return response(res, 400, 'Error', errors)
        }

        const results = await model.add(data)
        redis.redisDB.keys(`${req.baseUrl}*`, (err, res) => {
            if (!err) {
                res.forEach((val) => {
                    redis.redisDB.del(val)
                })
            }
        })
        return response(res, 201, 'Product added successfully', results)

    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

Product.edit = async (req, res) => {
    try {
        if (req.file === undefined) {
            let errors = {
                errors: {
                    image: [
                        "The image field is required."
                    ]
                }
            }
            return response(res, 400, 'Error', errors)
        }
        const data = {
            id: req.body.id,
            name: req.body.name,
            image: req.file.filename,
            price: req.body.price,
            stock: req.body.stock,
            category_id: req.body.category_id
        };
        const errors = validator.editProduct(data)
        if (errors) {
            fs.unlinkSync(req.file.path)
            return response(res, 400, 'Error', errors)
        }

        const results = await model.edit(data)
        redis.redisDB.keys(`${req.baseUrl}*`, (err, res) => {
            if (!err) {
                res.forEach((val) => {
                    redis.redisDB.del(val)
                })
            }
        })
        return response(res, 200, 'Product updated successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

Product.delete = async (req, res) => {
    try {
        const id = req.params.id
        const results = await model.delete(id)
        redis.redisDB.keys(`${req.baseUrl}*`, (err, res) => {
            if (!err) {
                res.forEach((val) => {
                    redis.redisDB.del(val)
                })
            }
        })
        return response(res, 200, 'Product deleted successfully', results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

Product.searchByName = async (req, res) => {
    try {
        const name = req.params.name
        const results = await model.searchByName(name)

        let message
        if (results.length === 0) {
            message = 'Data is not found'
        } else {
            message = 'Data is found'
        }
        const data_redis = JSON.stringify(results)
        redis.redisDB.setex(req.originalUrl, 30, data_redis)
        return response(res, 200, message, results)
    } catch (error) {
        return response(res, 500, 'Error', error)
    }
}

module.exports = Product