const albums = module.exports.albums = state => state.data.albums

const uploadsAlbum = module.exports.uploadsAlbum = state => {
    return albums(state).find(({ title }) => {
        const isWriteable = true
        return isWriteable && (title.toLowerCase() === 'uploads')
    })
}
