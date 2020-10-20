const database = require('../config/Databases')
const User = {}

User.getAll = () => {
    return new Promise((resolve, reject) => {
        database.query('SELECT id, name, username, role, created_at, updated_at FROM users ORDER BY id DESC')
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

User.getByUsername = (username) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM users WHERE username= '${username}'`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

User.getByUuid = (uuid) => {
    return new Promise((resolve, reject) => {

        database.query(`SELECT * FROM users WHERE uuid= '${uuid}'`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

User.getById = (id) => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM users WHERE id= '${id}'`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

User.add = (uuid, password, data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        database.query(`INSERT INTO users (uuid, name, username, password, role, created_at, updated_at) VALUES ('${uuid}', '${data.name}', '${data.username}', '${password}','${data.role}',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`)
            .then((res) => {
                resolve(res.rows)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

User.edit = (password, data) => {
    return new Promise((resolve, reject) => {
        database.query(`UPDATE users SET  name='${data.name}', username='${data.username}', password='${password}', role='${data.role}', updated_at=CURRENT_TIMESTAMP WHERE id=${data.id} RETURNING *`)
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

User.delete = (id) => {
    return new Promise((resolve, reject) => {
        database.query(`DELETE FROM users WHERE id=${id} RETURNING *`)
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



module.exports = User