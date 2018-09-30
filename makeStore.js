const {
    applyMiddleware,
    combineReducers,
    createStore,
} = require('redux')

const file = require('./lib/file')
const Data = require('./modules/Data')

const statePersister = store => next => action => {
    const result = next(action)
    const state = store.getState()
    file('state.json', state)
    return result
}

module.exports = function make(initialState = {}) {
    const middleware = applyMiddleware(statePersister)
    const reducer = combineReducers({
        data: Data.reducer
    })
    const store = createStore(reducer, initialState, middleware)
    return store
}