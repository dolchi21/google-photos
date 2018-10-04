const AlbumMediaItem = require('./modules/AlbumMediaItem')
const Timestamps = require('./modules/Timestamps')

const albums = module.exports.albums = state => state.albums

const albumsAge = module.exports.albumsAge = state => {
    return Timestamps.albumsAge(state.timestamps)
}

const mediaItems = module.exports.mediaItems = state => {
    return state.mediaItems.map(mediaItem => {
        const albumIds = AlbumMediaItem.mediaItemAlbums(state.albumMediaItem, mediaItem.id)
        return {
            ...mediaItem,
            albumIds
        }
    })
}

const mediaItemsAge = module.exports.mediaItemsAge = state => {
    return Timestamps.mediaItemsAge(state.timestamps)
}

const uploadsAlbum = module.exports.uploadsAlbum = state => {
    return albums(state).find(({ title }) => {
        const isWriteable = true
        return isWriteable && (title.toLowerCase() === 'uploads')
    })
}
