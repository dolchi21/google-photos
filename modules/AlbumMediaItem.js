const Module = require('./EntityFactory')

const { reducer, add, many, one, set } = module.exports = Module('ALBUM_MEDIA_ITEMS')

const addAlbumMediaItems = module.exports.addAlbumMediaItems = (albumId, mediaItems) => dispatch => {
    const relations = mediaItems.map(mediaItem => {
        return {
            id: [albumId, mediaItem.id].join(':'),
            albumId,
            mediaItemId: mediaItem.id
        }
    })
    const action = add(relations)
    dispatch(action)
}

const mediaItemAlbums = module.exports.mediaItemAlbums = (state, mediaItemId) => {
    return state.filter(relation => relation.mediaItemId === mediaItemId)
        .map(rel => rel.albumId)
        .filter((e, i, arr) => arr.indexOf(e) === i)
}
