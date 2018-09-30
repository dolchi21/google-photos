//@ts-check
const fs = require('fs')

const Auth = require('./auth')

module.exports = {
    albums,
    createMediaItem,
    upload,
}

async function albums(options = {}) {
    const { pageToken } = options
    const url = 'https://photoslibrary.googleapis.com/v1/albums'
    const client = await Auth.getAuthenticatedClient()
    const { data } = await client.request({
        url,
        params: {
            pageSize: 50,
            pageToken
        }
    })
    const albums = data.albums
    if (data.nextPageToken) {
        const nextAlbums = await albums({
            pageToken: data.nextPageToken
        })
        return albums.concat(nextAlbums)
    }
    return albums
}

async function createMediaItem(uploadToken, options = {}) {
    const {
        description = 'node-upload-' + Date.now()
    } = options
    const client = await Auth.getAuthenticatedClient()
    const res = await client.request({
        method: 'POST',
        url: 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
        data: {
            newMediaItems: [{
                description,
                simpleMediaItem: { uploadToken }
            }]
        }
    })
    return res.data.newMediaItemResults[0]
}

async function upload(stream, options = {}) {
    const data = typeof stream === typeof {}
        ? stream
        : fs.createReadStream(stream)

    const {
        filename = 'node-upload.mp4'
    } = options

    const client = await Auth.getAuthenticatedClient()

    const res = await client.request({
        method: 'POST',
        url: 'https://photoslibrary.googleapis.com/v1/uploads',
        data,
        maxContentLength: Infinity,
        headers: {
            'Content-Type': 'application/octet-stream',
            'X-Goog-Upload-File-Name': filename,
            'X-Goog-Upload-Protocol': 'raw'
        }
    })

    return res.data
}
