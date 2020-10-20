const database = require('../config/Databases')
const ip = require('ip');
const Product = {}

Product.getAll = (column, sort) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT T1.*, T2.name as category FROM products T1 INNER JOIN categories T2 ON T1.category_id=T2.id ORDER BY ${column} ${sort}`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

Product.get = (id) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM products WHERE id=${id}`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

Product.add = (data) => {
    return new Promise((resolve, reject) => {
        database.query(`INSERT INTO products (name, image, price, stock, category_id, created_at, updated_at) VALUES ('${data.name}', '${data.image}', ${data.price}, ${data.stock}, ${data.category_id}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP ) RETURNING *`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                if (err.code === "23503") {
                    reject('Category is not available')
                }
                reject(err)
            })
    })
}

Product.edit = (data) => {
    return new Promise((resolve, reject) => {
        database.query(`UPDATE products SET name='${data.name}', image='${data.image}', price='${data.price}', stock='${data.stock}', category_id='${data.category_id}', updated_at=CURRENT_TIMESTAMP WHERE id=${data.id} RETURNING *`)
            .then((res) => {
                if (res.rows.length === 0) {
                    reject('Data is not found')
                } else {
                    resolve(res.rows)
                }
            })
            .catch((err) => {
                if (err.code === "23503") {
                    reject('Category is not available')
                }
                reject(err)
            })
    })
}

Product.delete = (id) => {
    return new Promise((resolve, reject) => {
        database.query(`DELETE FROM products WHERE id=${id} RETURNING *`)
            .then((res) => {
                if (res.rows.length === 0) {
                    reject('Data is not found')
                } else {
                    resolve(res.rows)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

Product.searchByName = (name) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%${name}%')`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

Product.sort = (column) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM products ORDER BY ${column}`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}


module.exports = Product