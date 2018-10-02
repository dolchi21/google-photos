const Module = require('./EntityFactory')

const { reducer, many, one } = module.exports = Module('MEDIA_ITEMS')

const loadMediaItems = module.exports.loadMediaItems = gPhotos => async dispatch => {
    const t = many()
    dispatch(t.start())
    const mediaItems = await gPhotos.mediaItems()
    dispatch(t.end(mediaItems))
}
