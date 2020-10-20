const database = require('../config/Databases')
const Category = {}

Category.getAll = () => {
    return new Promise((resolve, reject) => {
        database.query('SELECT * FROM categories ORDER BY id DESC')
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

Category.add = (data) => {
    return new Promise((resolve, reject) => {
        database.query(`INSERT INTO categories (name, created_at, updated_at) VALUES ('${data.name}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

Category.edit = (data) => {
    return new Promise((resolve, reject) => {
        database.query(`UPDATE categories SET name='${data.name}', updated_at=CURRENT_TIMESTAMP WHERE id=${data.id} RETURNING *`)
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

Category.delete = (data) => {
    return new Promise((resolve, reject) => {
        database.query(`DELETE FROM categories WHERE id=${data.id} RETURNING *`)
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

module.exports = Category