//@ts-check
const LOAD_ALBUM = 'LOAD_ALBUM'
const LOAD_ALBUM_SUCCESS = 'LOAD_ALBUM_SUCCESS'
const LOAD_ALBUMS = 'LOAD_ALBUMS'
const LOAD_ALBUMS_SUCCESS = 'LOAD_ALBUMS_SUCCESS'
const LOAD_ALBUMS_ERROR = 'LOAD_ALBUMS_ERROR'

function reducer(state = [], action) {
    const { type, payload } = action
    switch (type) {
        case LOAD_ALBUM_SUCCESS: {
            const nextState = state.filter(album => album.id !== payload.id)
            return nextState.concat(payload)
        }
        case LOAD_ALBUMS_SUCCESS: {
            return [].concat(payload)
        }
        default: {
            return state
        }
    }
}

const album = album => ({
    type: LOAD_ALBUM_SUCCESS,
    payload: album
})

const loadAlbums = gPhotos => async dispatch => {
    dispatch({ type: LOAD_ALBUMS })
    try {
        const albums = await gPhotos.albums()
        dispatch(set(albums))
        return albums
    } catch (err) {
        dispatch({ type: LOAD_ALBUMS_ERROR, payload: err })
    }
}

const set = albums => ({
    type: LOAD_ALBUMS_SUCCESS,
    payload: albums
})

module.exports = {
    LOAD_ALBUMS,
    LOAD_ALBUMS_SUCCESS,
    LOAD_ALBUMS_ERROR,
    reducer,
    album,
    loadAlbums,
    set
}