const Queue = require('promise-queue')
const {
    applyMiddleware,
    combineReducers,
    createStore,
} = require('redux')
const thunk = require('redux-thunk').default

const file = require('./lib/file')

const Albums = require('./modules/Albums')
const Data = require('./modules/Data')
const MediaItems = require('./modules/MediaItems')
const Tasks = require('./modules/Tasks')
const Timestamps = require('./modules/Timestamps')

const statePersister = filename => {
    const queue = new Queue(1)
    return store => next => async action => {
        const result = next(action)
        const state = store.getState()
        queue.add(() => file(filename, state))
        return result
    }
}

module.exports = function make(initialState = {}, options = {}) {
    const persister = options.storage ? statePersister(options.storage) : null
    const middleware = persister
        ? applyMiddleware(thunk, persister)
        : applyMiddleware(thunk)
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
        data: Data.reducer,
        mediaItems: MediaItems.reducer,
        tasks: Tasks.reducer,
        timestamps: Timestamps.reducer
    })
    const store = createStore(reducer, initialState, middleware)
    return store
}