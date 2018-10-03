//@ts-check
const { LOAD_ALBUMS_SUCCESS } = require('./Albums')
const MediaItems = require('./MediaItems')
const Tasks = require('./Tasks')

const reducer = module.exports.reducer = function reducer(state = {}, action) {
    if (action.type.indexOf('@@redux/INIT') === 0) return state
    switch (action.type) {
        case Tasks.RUNNING:
        case Tasks.SUCCESS:
        case Tasks.ERROR: {
            const key = `${action.payload}/${action.type}`
            return {
                ...state,
                [key]: Date.now()
            }
        }
        default:
            return {
                ...state,
                [action.type]: Date.now()
            }
    }
}

const albumsAge = module.exports.albumsAge = state => {
    const updatedAt = state[LOAD_ALBUMS_SUCCESS]
    if (!updatedAt) return Infinity
    return Date.now() - updatedAt
}

const mediaItemsAge = module.exports.mediaItemsAge = state => {
    const updatedAt = state[MediaItems.LOAD_MANY_SUCCESS]
    if (!updatedAt) return Infinity
    return Date.now() - updatedAt
}
