const { combineReducers } = require('redux')

const Albums = require('./Albums')
const AlbumMediaItem = require('./AlbumMediaItem')
const Data = require('./Data')
const MediaItems = require('./MediaItems')
const Tasks = require('./Tasks')
const Timestamps = require('./Timestamps')

const reducer = combineReducers({
    actions: (state = [], action) => {
        if (action.type.indexOf('@@redux/INIT') === 0) return [action]
        const _action = {
            ...action,
            $date: Date.now()
        }
        switch (action.type) {
            case Albums.LOAD_ALBUMS_SUCCESS: {
                delete _action.payload
                return state.concat(_action)
            }
            case MediaItems.LOAD_MANY_SUCCESS: {
                delete _action.payload
                return state.concat(_action)
            }
            default:
                return state.concat(_action)
        }
    },
    albums: Albums.reducer,
    albumMediaItem: AlbumMediaItem.reducer,
    data: Data.reducer,
    mediaItems: MediaItems.reducer,
    tasks: Tasks.reducer,
    timestamps: Timestamps.reducer
})

module.exports = reducer