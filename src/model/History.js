const database = require('../config/Databases')
const History = {}

History.getAll = () => {
    return new Promise((resolve, reject) => {
        database.query('SELECT * FROM histories ORDER BY id DESC')
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

History.add = (data) => {
    return new Promise((resolve, reject) => {
        database.query(`INSERT INTO histories (invoices, cashier, date, orders, amount, created_at, updated_at) VALUES ('${data.invoices}', '${data.cashier}', '${data.date}', '${data.orders}', ${data.amount}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

History.edit = (data) => {
    return new Promise((resolve, reject) => {
        database.query(`UPDATE histories SET invoices='${data.invoices}', cashier='${data.cashier}', date='${data.date}', orders='${data.orders}', amount=${data.amount}, updated_at=CURRENT_TIMESTAMP WHERE id=${data.id} RETURNING *`)
            .then((res) => {
                if (res.rows.length === 0) {
                    reject('Data tidak ditemukan')
                } else {
                    resolve(res.rows)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

History.delete = (data) => {
    return new Promise((resolve, reject) => {
        database.query(`DELETE FROM histories WHERE id=${data.id} RETURNING *`)
            .then((res) => {
                if (res.rows.length === 0) {
                    reject('Data tidak ditemukan')
                } else {
                    resolve(res.rows)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

module.exports = History