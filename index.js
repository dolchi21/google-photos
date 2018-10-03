//@ts-check
const TIME = {
    M: 1000 * 60,
    H: 1000 * 60 * 60,
    D: 1000 * 60 * 60 * 24
}
const md5 = require('md5-file/promise')
const { bindActionCreators } = require('redux')

const ActionCreators = require('./actionCreators')
const makeStore = require('./makeStore')
const S = require('./selectors')
const file = require('./lib/file')

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
    const A = bindActionCreators(ActionCreators, store.dispatch)

    //await A.loadMediaItems(gPhotos)

    const albumsAge = S.albumsAge(store.getState())
    if (TIME.H < albumsAge) await A.loadAlbums(gPhotos)


    let uploadsAlbum = S.uploadsAlbum(store.getState())
    if (!uploadsAlbum) {
        await A.createAlbum(gPhotos, 'uploads')
        uploadsAlbum = S.uploadsAlbum(store.getState())
    }

    const uploads = await A.loadAlbumMediaItems(gPhotos, uploadsAlbum.id)

    return uploadsAlbum
}

main().catch(err => {
    console.log(err)
})
