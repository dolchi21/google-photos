const Queue = require('promise-queue')
const {
    applyMiddleware,
    combineReducers,
    createStore,
} = require('redux')
const thunk = require('redux-thunk').default

const file = require('./lib/file')
const Data = require('./modules/Data')

const statePersister = filename => {
    const queue = new Queue(1)
    return store => next => async action => {
        const result = next(action)
        const state = store.getState()
        queue.add(() => file(filename, state))
        return result
    }
}

module.exports = function make(initialState = {}) {
    const persister = statePersister('state.json')
    const middleware = applyMiddleware(thunk, persister)
    const reducer = combineReducers({
        data: Data.reducer
    })
    const store = createStore(reducer, initialState, middleware)
    return store
}