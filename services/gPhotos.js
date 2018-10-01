//@ts-check
const fs = require('fs')

const Auth = require('./auth')

module.exports = {
    album,
    albums,
    createAlbum,
    createMediaItem,
    mediaItems,
    upload,
}

async function album(id) {
    const url = 'https://photoslibrary.googleapis.com/v1/albums/' + id
    const client = await Auth.getAuthenticatedClient()
    const { data } = await client.request({ url })
    return data
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
    if (data.nextPageToken) {
        const nextAlbums = await albums({
            pageToken: data.nextPageToken
        })
        return data.albums.concat(nextAlbums)
    }
    return data.albums
}

async function createAlbum(title) {
    const client = await Auth.getAuthenticatedClient()
    const res = await client.request({
        method: 'POST',
        url: 'https://photoslibrary.googleapis.com/v1/albums',
        data: {
            album: {
                title
            }
        }
    })
    return res.data
}

async function createMediaItem(uploadToken, options = {}) {
    const {
        albumId,
        description = 'node-upload-' + Date.now()
    } = options
    const client = await Auth.getAuthenticatedClient()
    const res = await client.request({
        method: 'POST',
        url: 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
        data: {
            albumId,
            newMediaItems: [{
                description,
                simpleMediaItem: { uploadToken }
            }]
        }
    })
    return res.data.newMediaItemResults[0]
}

async function mediaItems(options = {}) {
    const { pageToken } = options
    const url = 'https://photoslibrary.googleapis.com/v1/mediaItems'
    const client = await Auth.getAuthenticatedClient()
    const { data } = await client.request({
        url,
        params: {
            pageSize: 100,
            pageToken
        }
    })
    if (data.nextPageToken) {
        const nextBatch = await mediaItems({
            pageToken: data.nextPageToken
        })
        return data.mediaItems.concat(nextBatch)
    }
    return data.mediaItems
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
