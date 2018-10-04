//@ts-check
const Task = (start, end, error) => ({
    start: () => ({ type: start }),
    end: payload => ({ type: end, payload }),
    error: payload => ({ type: error, payload })
})
module.exports = (namespace, options = {}) => {
    const ADD = `${namespace}/ADD`
    const LOAD_ONE = `${namespace}/LOAD_ONE`
    const LOAD_ONE_SUCCESS = `${namespace}/LOAD_ONE_SUCCESS`
    const LOAD_MANY = `${namespace}/LOAD_MANY`
    const LOAD_MANY_SUCCESS = `${namespace}/LOAD_MANY_SUCCESS`
    const SET = `${namespace}/SET`

    const reducer = (state = [], action) => {
        const { type, payload } = action
        switch (type) {
            case ADD: {
                const newIds = payload.map(e => e.id)
                const nextState = state.filter(e => newIds.indexOf(e.id) === -1)
                return nextState.concat(payload)
            }
            case LOAD_ONE_SUCCESS: {
                const nextState = state.filter(e => e.id === payload.id)
                return nextState.concat(payload)
            }
            case LOAD_MANY_SUCCESS:
            case SET: {
                return [].concat(action.payload)
            }
            default: {
                return state
            }
        }
    }

    return {
        LOAD_ONE_SUCCESS,
        LOAD_MANY_SUCCESS,
        reducer,
        add: payload => ({
            type: ADD,
            payload
        }),
        //many: Task(LOAD_MANY, LOAD_MANY_SUCCESS),
        many: () => ({
            start: () => ({ type: LOAD_MANY }),
            end: payload => ({
                type: LOAD_MANY_SUCCESS,
                payload
            })
        }),
        one: () => ({
            start: () => ({ type: LOAD_ONE }),
            end: payload => ({
                type: LOAD_ONE_SUCCESS,
                payload
            })
        }),
        set: payload => ({
            type: SET,
            payload
        })
    }
}