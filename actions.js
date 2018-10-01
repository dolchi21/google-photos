//@ts-check
const Data = require('./modules/Data')
const { Task } = require('./modules/Tasks')

const createAlbum = (gPhotos, title) => async dispatch => {
    const t = Task('createAlbum')
    dispatch(t.start())
    const album = await gPhotos.createAlbum(title)
    dispatch(t.end())
    dispatch(loadAlbums(gPhotos))
}

const loadAlbums = gPhotos => async dispatch => {
    const t = Task('loadAlbums')
    dispatch(t.start())
    const albums = await gPhotos.albums()
    const action = Data.set('albums', albums)
    dispatch(action)
    dispatch(t.end())
}

const loadMediaItems = gPhotos => async dispatch => {
    const t = Task('loadMediaItems')
    dispatch(t.start())
    const mediaItems = await gPhotos.mediaItems()
    const action = Data.set('mediaItems', mediaItems)
    dispatch(action)
    dispatch(t.end())
}

module.exports = {
    createAlbum,
    loadAlbums,
    loadMediaItems,
}