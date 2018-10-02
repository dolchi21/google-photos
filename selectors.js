const Timestamps = require('./modules/Timestamps')

const albums = module.exports.albums = state => state.albums

const uploadsAlbum = module.exports.uploadsAlbum = state => {
    return albums(state).find(({ title }) => {
        const isWriteable = true
        return isWriteable && (title.toLowerCase() === 'uploads')
    })
}

const albumsAge = module.exports.albumsAge = state => {
    return Timestamps.albumsAge(state.timestamps)
}

const mediaItemsAge = module.exports.mediaItemsAge = state => {
    return Timestamps.mediaItemsAge(state.timestamps)
}
