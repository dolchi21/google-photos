//@ts-check
const fs = require('fs')
const { OAuth2Client } = require('google-auth-library')
const http = require('http')
const opn = require('opn')
const querystring = require('querystring')
const url = require('url')

module.exports = {
    TokensManager,
    getAccessToken,
    getAuthenticatedClient
}

function TokensManager() {
    const filename = 'tokens.json'
    return {
        set(tokens) {
            const str = JSON.stringify(tokens, null, 2)
            fs.writeFileSync(filename, str)
        },
        get() {
            try {
                return JSON.parse(fs.readFileSync(filename).toString())
            } catch (err) {
                return null
            }
        }
    }
}
async function tryRefreshAccessToken(oAuth2Client) {
    try {
        const tm = TokensManager()
        const tokens = await tm.get()
        oAuth2Client.setCredentials(tokens);
        const r = await oAuth2Client.refreshAccessToken()
        tm.set(r.credentials)
        return oAuth2Client
    } catch (err) {
        console.log('refresh', err)
    }
}
let authenticatedClient = null
function getAuthenticatedClient() {
    if (authenticatedClient) return Promise.resolve(authenticatedClient)
    //@ts-ignore
    const keys = require('../credentials.json').installed
    const tokensManager = TokensManager()
    return new Promise(async (resolve, reject) => {
        // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
        // which should be downloaded from the Google Developers Console.
        const oAuth2Client = new OAuth2Client(
            keys.client_id,
            keys.client_secret,
            keys.redirect_uris[0]
        );

        const refreshedClient = tryRefreshAccessToken(oAuth2Client)
        if (refreshedClient) return resolve(refreshedClient)

        // Generate the url that will be used for the consent dialog.
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/photoslibrary'
        });

        // Open an http server to accept the oauth callback. In this simple example, the
        // only request to our webserver is to /oauth2callback?code=<code>
        const server = http.createServer(async (req, res) => {
            if (req.url.indexOf('/oauth2callback') > -1) {
                // acquire the code from the querystring, and close the web server.
                const qs = querystring.parse(url.parse(req.url).query);
                console.log(`Code is ${qs.code}`);
                res.end('Authentication successful! Please return to the console.');
                server.close();

                // Now that we have the code, use that to acquire tokens.
                try {
                    //@ts-ignore
                    const r = await oAuth2Client.getToken(qs.code)
                    // Make sure to set the credentials on the OAuth2 client.
                    tokensManager.set(r.tokens)
                    oAuth2Client.setCredentials(r.tokens);
                    console.info('Tokens acquired.');
                    resolve(oAuth2Client);
                } catch (err) {
                    reject(err)
                }
            }
        }).listen(3000, () => {
            // open the browser to the authorize url to start the workflow
            opn(authorizeUrl);
        });
    });
}
async function getAccessToken() {
    const client = await getAuthenticatedClient()
    return client.credentials.access_token
}