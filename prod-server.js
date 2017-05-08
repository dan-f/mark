const fs = require('fs')
const path = require('path')
const url = require('url')

const compression = require('compression')
const connect = require('connect')
const timeout = require('connect-timeout')
const serveStatic = require('serve-static')

const staticRoot = path.join(__dirname, '/public')

const app = connect()

// The only current "app logic" is to serve the index.html regardless of the
// path route, unless the route ends in '.html', '.css', or '.js'.
app.use((req, res, next) => {
  const parsedUrl = url.parse(req.url)
  const route = parsedUrl.pathname
  const isPathToStaticFile = !!['.html', 'css', '.js', '.map', '.ico', '.svg', '.jpg', '.png', '.gif'].find(ext => route.endsWith(ext))
  if (!isPathToStaticFile) {
    parsedUrl.pathname = '/'
    req.url = url.format(parsedUrl)
  }
  next()
})

app.use(serveStatic(staticRoot, {
  maxAge: '14 days',
  fallthrough: false
}))

app.use(compression())

app.use(timeout('5s'))

/*
 * (Environment variable) options:
 *   - INSECURE: When provided, runs over http
 *   - PORT: When provided, specifies the port.  In insecure mode defaults to 3000,
 *     in secure mode defaults to 443.
 *   - TLS_CERT: The fully-qualified path to the tls certificate file.
 *   - TLS_KEY: The fully-qualified path to the tls key file.
 *   - HOSTNAME: When provided, specifies the hostname of the server.
 */
const { INSECURE, PORT, TLS_CERT, TLS_KEY, HOSTNAME } = process.env

if (INSECURE) {
  console.warn(
    'WARNING: Running the production server in insecure mode.\n' +
    'Only do this if you are testing the production build locally.\n'
  )
  const http = require('http')
  const port = PORT || 3000
  http.createServer(app).listen(port)
  console.log(`...running on http://127.0.0.1:${port}`)
} else {
  const https = require('https')
  let key, cert
  try {
    key = fs.readFileSync(TLS_KEY)
    cert = fs.readFileSync(TLS_CERT)
  } catch (e) {
    console.error("Couldn't read the tls key or cert files.  You must pass environment variables TLS_KEY and TLS_CERT to specify paths to the key and cert, respectively, if not using INSECURE mode.\n")
    throw e
  }
  const options = {
    key: fs.readFileSync(TLS_KEY),
    cert: fs.readFileSync(TLS_CERT)
  }
  https.createServer(options, app).listen(PORT || 443, HOSTNAME)
}
