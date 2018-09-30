//@ts-check
const ERROR = 'TASK_ERROR'
const RUNNING = 'TASK_RUNNING'
const SUCCESS = 'TASK_SUCCESS'

const reducer = (state = {}, action) => {
    switch (action.type) {
        case ERROR: {
            return {
                ...state,
                [action.payload]: ERROR
            }
        }
        case RUNNING: {
            return {
                ...state,
                [action.payload]: RUNNING
            }
        }
        case SUCCESS: {
            return {
                ...state,
                [action.payload]: SUCCESS
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