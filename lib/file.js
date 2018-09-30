const fs = require('fs')

module.exports = async (filename, data) => {
    if (data) {
        const str = JSON.stringify(data, null, 2)
        return await write(filename, str)
    }
    const str = await read(filename)
    return JSON.parse(str)
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