//@ts-check
const TIME = {
    M: 1000 * 60,
    H: 1000 * 60 * 60,
    D: 1000 * 60 * 60 * 24
}
const md5 = require('md5-file/promise')

const file = require('./lib/file')
const makeStore = require('./makeStore')
const A = require('./actions')
const S = require('./selectors')

const gPhotos = require('./services/gPhotos')

async function uploadTest() {
    const initialState = await file('state.json')
    const store = makeStore(initialState, {
        storage: 'state.json'
    })
    const uploadsAlbum = S.uploadsAlbum(store.getState())

    if (!uploadsAlbum) throw new Error('MissingUploadsAlbum')

    const filename = 'upload-me.mp4'
    const md5Checksum = await md5(filename)
    const upload_token = await gPhotos.upload(filename, {
        filename: `${md5Checksum}.mp4`
    })

    const item = await gPhotos.createMediaItem(upload_token, {
        albumId: uploadsAlbum.id,
        description: md5Checksum
    })

    return item
}

async function findUploadsAlbum() {
    const albums = await gPhotos.albums()
    const album = albums.find(({ title }) =>
        title.toLowerCase() === 'uploads')
    return album
}

async function main() {
    const initialState = await file('state.json')
    const store = makeStore(initialState, {
        storage: 'state.json'
    })
    await store.dispatch(A.loadMediaItems(gPhotos))

    const albumsAge = S.albumsAge(store.getState())
    if (TIME.H < albumsAge) {
        const loadAlbums = A.loadAlbums(gPhotos)
        await store.dispatch(loadAlbums)
    }


    let uploadsAlbum = S.uploadsAlbum(store.getState())
    if (!uploadsAlbum) {
        await store.dispatch(A.createAlbum(gPhotos, 'uploads'))
        uploadsAlbum = S.uploadsAlbum(store.getState())
    }

    return uploadsAlbum
}

main().catch(err => {
    console.log(err)
})
