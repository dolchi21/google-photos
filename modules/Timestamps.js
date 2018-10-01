
const reducer = module.exports.reducer = function reducer(state = {}, action) {
    return {
        ...state,
        [action.type]: new Date()
    }
}
