//@ts-check
const { LOAD_ALBUMS, LOAD_ALBUMS_SUCCESS, LOAD_ALBUMS_ERROR } = require('./Albums')

const ERROR = 'TASK_ERROR'
const RUNNING = 'TASK_RUNNING'
const SUCCESS = 'TASK_SUCCESS'

const reducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_ALBUMS:
        case LOAD_ALBUMS_SUCCESS:
        case LOAD_ALBUMS_ERROR: {
            return {
                ...state,
                albums: action.type
            }
        }
        case RUNNING:
        case SUCCESS:
        case ERROR: {
            return {
                ...state,
                [action.payload]: action.type
            }
        }
        default: {
            return state
        }
    }
}

function Task(name) {
    return {
        start: () => ({
            type: RUNNING, payload: name
        }),
        end: err => ({
            type: err ? ERROR : SUCCESS,
            payload: name
        })
    }
}

module.exports = {
    reducer,
    Task
}