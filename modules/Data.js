//@ts-check
const REMOVE = 'REMOVE_DATA'
const SET = 'SET_DATA'
const TOGGLE = 'TOGGLE_DATA'

function reducer(state = {}, action) {
    const { type, payload } = action
    switch (type) {
        case REMOVE: {
            const nextState = Object.assign({}, state)
            delete nextState[payload]
            return nextState
        }
        case SET: {
            return Object.assign({}, state, payload)
        }
        case TOGGLE: {
            const nextValue = !state[payload]
            return {
                ...state,
                [payload]:nextValue
            }
            return Object.assign({}, state, {
                [payload]: nextValue
            })
        }
        default: {
            return state
        }
    }
}

const remove = key => ({
    type: REMOVE,
    payload: key
})

const set = (key, value) => ({
    type: SET,
    payload: { [key]: value }
})

module.exports = {
    reducer,
    remove,
    set
}