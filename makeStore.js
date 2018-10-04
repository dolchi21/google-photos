const Queue = require('promise-queue')
const {
    applyMiddleware,
    createStore,
} = require('redux')
const thunk = require('redux-thunk').default

const file = require('./lib/file')

const statePersister = filename => {
    const queue = new Queue(1)
    return store => next => async action => {
        const result = next(action)
        const state = store.getState()
        queue.add(() => file(filename, state))
        return result
    }
}

const reducer = require('./modules/reducer')

module.exports = function make(initialState = {}, options = {}) {
    const persister = options.storage ? statePersister(options.storage) : null
    const middleware = persister
        ? applyMiddleware(thunk, persister)
        : applyMiddleware(thunk)
    
    const store = createStore(reducer, initialState, middleware)
    return store
}