const Queue = require('promise-queue')
const {
    applyMiddleware,
    combineReducers,
    createStore,
} = require('redux')
const thunk = require('redux-thunk').default

const file = require('./lib/file')
const Data = require('./modules/Data')
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
        data: Data.reducer,
        tasks: Tasks.reducer,
        timestamps: Timestamps.reducer
    })
    const store = createStore(reducer, initialState, middleware)
    return store
}