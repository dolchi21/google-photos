//@ts-check
module.exports = (namespace, options = {}) => {
    const LOAD_ONE = `${namespace}/LOAD_ONE`
    const LOAD_ONE_SUCCESS = `${namespace}/LOAD_ONE_SUCCESS`
    const LOAD_MANY = `${namespace}/LOAD_MANY`
    const LOAD_MANY_SUCCESS = `${namespace}/LOAD_MANY_SUCCESS`

    const reducer = (state = [], action) => {
        const { type, payload } = action
        switch (type) {
            case LOAD_ONE_SUCCESS: {
                const nextState = state.filter(e => e.id === payload.id)
                return nextState.concat(payload)
            }
            case LOAD_MANY_SUCCESS: {
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
        })
    }
}