const fs = require('fs')
const md5 = require('md5-file/promise')
const opn = require('opn')

const gPhotos = require('./services/gPhotos')
const { createMediaItem, upload } = gPhotos

async function uploadTest() {
    const filename = 'upload-me.mp4'
    const md5Checksum = await md5(filename)
    const upload_token = await upload(filename, {
        filename: `${md5Checksum}.mp4`
    })
    const item = await createMediaItem(upload_token, {
        description: md5Checksum
    })
    return item
}

async function main() {
    const albums = await gPhotos.albums()
    return albums
}

main().catch(err => {
    console.log(err)
})
