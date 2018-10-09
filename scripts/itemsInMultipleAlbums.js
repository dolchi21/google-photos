//@ts-check
const makeStore = require('../makeStore')
const S = require('../selectors')
const file = require('../lib/file')

async function main() {
    const initialState = await file('state.json')
    const store = makeStore(initialState, { storage: 'state.json' })
    const state = store.getState()

    const mediaItems = S.mediaItems(state).filter(item => 1 < item.albumIds.length)
        .filter(item => item.filename.indexOf('Simpsons') === -1)
        .map(item => {
            item.albums = item.albumIds.map(id => S.album(state, id))
            return item
        })

    return mediaItems
}

main().catch(err => console.error(err))
