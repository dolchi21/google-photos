//@ts-check
const Data = require('./modules/Data')

const loadAlbums = gPhotos => async dispatch => {
    const albums = await gPhotos.albums()
    const action = Data.set('albums', albums)
    return dispatch(action)
}

module.exports = {
    loadAlbums
}