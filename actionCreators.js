//@ts-check
const Albums = require('./modules/Albums')
const Data = require('./modules/Data')
const MediaItems = require('./modules/MediaItems')
const { Task } = require('./modules/Tasks')

const createAlbum = (gPhotos, title) => async dispatch => {
    const t = Task('createAlbum')
    dispatch(t.start())
    const album = await gPhotos.createAlbum(title)
    dispatch(t.end())
    dispatch(loadAlbums(gPhotos))
}

const loadAlbums = Albums.loadAlbums
const loadMediaItems = MediaItems.loadMediaItems

const upload = (gPhotos, file, options = {}) => async dispatch => {
    const t = Task('upload')
    dispatch(t.start())
    const uploadToken = await gPhotos.upload(file, options)
    const action = Data.set('uploadToken', uploadToken)
    dispatch(action)
    dispatch(t.end())
    return uploadToken
}

module.exports = {
    createAlbum,
    loadAlbums,
    loadMediaItems,
    upload,
}