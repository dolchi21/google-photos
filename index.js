//@ts-check
const TIME = {
    M: 1000 * 60,
    H: 1000 * 60 * 60,
    D: 1000 * 60 * 60 * 24
}
const md5 = require('md5-file/promise')
const Queue = require('promise-queue')
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

    const state1 = store.getState()
    const albumsAge = S.albumsAge(state1)
    const mediaItemsAge = S.mediaItemsAge(state1)

    console.log('loading data')
    if (TIME.H < albumsAge) await A.loadAlbums(gPhotos)
    if (TIME.H < mediaItemsAge) await A.loadMediaItems(gPhotos)

    /*let uploadsAlbum = S.uploadsAlbum(store.getState())
    if (!uploadsAlbum) {
        await A.createAlbum(gPhotos, 'uploads')
        uploadsAlbum = S.uploadsAlbum(store.getState())
    }*/

    const AlbumMediaItem = require('./modules/AlbumMediaItem')

    const albumsMediaItemsQueue = new Queue(10)
    const albumsMediaItemsTasks = S.albums(store.getState()).map(album => {
        return albumsMediaItemsQueue.add(async () => {
            const mediaItems = await A.loadAlbumMediaItems(gPhotos, album.id)
            console.log('album', album.title, 'mediaItems', mediaItems)
            if (!mediaItems) return
            AlbumMediaItem.addAlbumMediaItems(album.id, mediaItems)(store.dispatch)
        })
    })
    await Promise.all(albumsMediaItemsTasks)

    //const uploads = await A.loadAlbumMediaItems(gPhotos, uploadsAlbum.id)

    const mediaItems = S.mediaItems(store.getState())

    const soloItems = mediaItems.filter(item => {
        return item.albumIds.length === 0
    })

    return mediaItems
}

main().catch(err => {
    console.log(err)
})
