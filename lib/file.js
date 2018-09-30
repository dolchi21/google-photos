const fs = require('fs')

module.exports = async (filename, data) => {
    if (data) {
        const str = JSON.stringify(data, null, 2)
        sleep(1000)
        return await write(filename, str)
    }
    try {
        const str = await read(filename)
        return JSON.parse(str)
    } catch (err) {
        return null
    }
}

function read(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, buffer) => {
            if (err) return reject(err)
            const str = buffer.toString()
            resolve(str)
        })
    })
}
function write(filename, str) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, str, err =>
            err ? reject(err) : resolve())
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}