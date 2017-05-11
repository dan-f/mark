/* eslint-env mocha */
import Immutable from 'immutable'
import nock from 'nock'
import { mock } from 'sinon'

import { expect, mockStoreFactory } from './common'
import * as Actions from '../src/actions'
import * as AT from '../src/actionTypes'

describe('Actions', () => {
  const webId = 'https://localhost:8443/profile/card#me'
  const key = 'abc123'
  let store

  const noxy = base => {
    const scope = nock(base)
    const scopeProto = Object.getPrototypeOf(scope)
    scopeProto.proxy = function (method, path, ...args) {
      return this.intercept('/,proxy', method, ...args)
        .query({ uri: `${this.basePath}${path}`, key })
    }
    return scope
  }

  beforeEach(() => {
    store = mockStoreFactory({
      auth: { webId, key },
      endpoints: {
        login: 'https://localhost:8443/,login',
        logout: 'https://localhost:8443/,logout',
        proxy: 'https://localhost:8443/,proxy?uri=',
        twinql: 'https://localhost:8443/,twinql'
      }
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('loadProfile', () => {
    it('loads the profile', () => {
      nock('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'foaf': 'http://xmlns.com/foaf/0.1/'
          },
          '@id': webId,
          'foaf:img': { '@id': 'https://localhost:8443/me.jpg' }
        })

      return store.dispatch(Actions.loadProfile())
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_LOAD_PROFILE_REQUEST },
            {
              type: AT.BOOKMARKS_LOAD_PROFILE_SUCCESS,
              profile: { 'foaf:img': 'https://localhost:8443/me.jpg' }
            }
          ])
        })
    })

    it('fires an app error when the profile fails to load', () => {
      nock('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'foaf': 'http://xmlns.com/foaf/0.1/'
          },
          '@id': webId,
          '@error': { message: 'Internal Server Error' }
        })

      return store.dispatch(Actions.loadProfile())
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_LOAD_PROFILE_REQUEST },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: `Couldn't load your profile`,
              message: 'Internal Server Error'
            }
          ])
        })
    })
  })

  describe('maybeInstallAppResources', () => {
    it('registers bookmarks in the type index and sets the bookmarks url', () => {
      noxy('https://localhost:8443/')
        // Query to test whether the bookmarks container already exists
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'solid': 'http://solid.github.io/vocab/solid-terms.ttl#',
            'book': 'http://www.w3.org/2002/01/bookmark#'
          },
          '@id': webId,
          'solid:publicTypeIndex': {
            '@id': 'https://localhost:8443/Preferences/publicTypeIndex.ttl',
            '@graph': []
          }
        })
        // No type registration for bookmarks, hence we're now installing the
        // app workspace and type registration.
        // Query to find the storage container
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'pim': 'http://www.w3.org/ns/pim/space#'
          },
          '@id': webId,
          'pim:storage': { '@id': 'https://localhost:8443/' }
        })
        // HEAD to test whether the bookmarks container already exists
        .proxy('HEAD', '/Applications/mark/bookmarks/.config')
        .reply(404)
        // POST to create the bookmarks container
        .proxy('PUT', '/Applications/mark/bookmarks/.config')
        .reply(200)
        // query to find the public type index
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'solid': 'http://solid.github.io/vocab/solid-terms.ttl#'
          },
          '@id': 'https://dan-f.databox.me/profile/card#me',
          'solid:publicTypeIndex': { '@id': 'https://localhost:8443/Preferences/publicTypeIndex.ttl' }
        })
        // PATCH to update the public type index with the bookmarks type registration
        .proxy('PATCH', '/Preferences/publicTypeIndex.ttl')
        .reply(200)

      return store.dispatch(Actions.maybeInstallAppResources())
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_CONTAINER_REQUEST },
            { type: AT.BOOKMARKS_CREATE_CONTAINER_SUCCESS, bookmarksContainerUrl: 'https://localhost:8443/Applications/mark/bookmarks/' },
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: 'https://localhost:8443/Applications/mark/bookmarks/' }
          ])
        })
    })

    it('fires an app error if the bookmarks resource cannot be created', () => {
      noxy('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'solid': 'http://solid.github.io/vocab/solid-terms.ttl#',
            'book': 'http://www.w3.org/2002/01/bookmark#'
          },
          '@id': webId,
          'solid:publicTypeIndex': {
            '@id': 'https://localhost:8443/Preferences/publicTypeIndex.ttl',
            '@graph': []
          }
        })
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'pim': 'http://www.w3.org/ns/pim/space#'
          },
          '@id': webId,
          'pim:storage': { '@id': 'https://localhost:8443/' }
        })
        .proxy('HEAD', '/Applications/mark/bookmarks/.config')
        .reply(404)
        .proxy('PUT', '/Applications/mark/bookmarks/.config')
        .reply(500)

      return store.dispatch(Actions.maybeInstallAppResources())
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_CONTAINER_REQUEST },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: `Couldn't install your bookmarks container`,
              message: 'Internal Server Error'
            }
          ])
        })
    })
  })

  describe('getBookmarksContainer', () => {
    it('finds the bookmarks container in the type registry', () => {
      nock('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'solid': 'http://solid.github.io/vocab/solid-terms.ttl#',
            'book': 'http://www.w3.org/2002/01/bookmark#'
          },
          '@id': webId,
          'solid:publicTypeIndex': {
            '@id': 'https://localhost:8443/Preferences/publicTypeIndex.ttl',
            '@graph': [{
              '@id': 'https://localhost:8443/Preferences/publicTypeIndex.ttl#some-registration',
              'solid:instanceContainer': { '@id': 'https://localhost:8443/path/to/bookmarks' }
            }]
          }
        })

      return store.dispatch(Actions.getBookmarksContainer())
        .then(containerUrl => {
          expect(containerUrl).to.equal('https://localhost:8443/path/to/bookmarks')
          expect(store.getActions()).to.eql([])
        })
    })

    it('may find no bookmarks container in the type registry', () => {
      nock('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'solid': 'http://solid.github.io/vocab/solid-terms.ttl#',
            'book': 'http://www.w3.org/2002/01/bookmark#'
          },
          '@id': webId,
          'solid:publicTypeIndex': {
            '@id': 'https://localhost:8443/Preferences/publicTypeIndex.ttl',
            '@graph': []
          }
        })

      return store.dispatch(Actions.getBookmarksContainer())
        .then(containerUrl => {
          expect(containerUrl).to.be.null
          expect(store.getActions()).to.eql([])
        })
    })

    it('fires an app error if there is an error finding the registration', () => {
      nock('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'solid': 'http://solid.github.io/vocab/solid-terms.ttl#',
            'book': 'http://www.w3.org/2002/01/bookmark#'
          },
          '@error': {
            'type': 'HttpError',
            'message': 'Internal Server Error'
          }
        })

      return store.dispatch(Actions.getBookmarksContainer())
        .catch(() => {
          expect(store.getActions()).to.eql([
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: `Couldn't find your Mark installation`,
              message: 'Internal Server Error'
            }
          ])
        })
    })
  })

  describe('createBookmarksContainer', () => {
    it('creates the bookmarks solid resource if it has not yet been created', () => {
      noxy('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'pim': 'http://www.w3.org/ns/pim/space#'
          },
          '@id': webId,
          'pim:storage': { '@id': 'https://localhost:8443/' }
        })
        .proxy('HEAD', '/Applications/mark/bookmarks/.config')
        .reply(404)
        .proxy('PUT', '/Applications/mark/bookmarks/.config')
        .reply(200)

      return store.dispatch(Actions.createBookmarksContainer())
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_CONTAINER_REQUEST },
            { type: AT.BOOKMARKS_CREATE_CONTAINER_SUCCESS, bookmarksContainerUrl: 'https://localhost:8443/Applications/mark/bookmarks/' }
          ])
        })
    })

    it('finds the bookmarks solid resource if it already exists', () => {
      noxy('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'pim': 'http://www.w3.org/ns/pim/space#'
          },
          '@id': webId,
          'pim:storage': { '@id': 'https://localhost:8443/' }
        })
        .proxy('HEAD', '/Applications/mark/bookmarks/.config')
        .reply(200)

      return store.dispatch(Actions.createBookmarksContainer())
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_CONTAINER_REQUEST },
            { type: AT.BOOKMARKS_CREATE_CONTAINER_SUCCESS, bookmarksContainerUrl: 'https://localhost:8443/Applications/mark/bookmarks/' }
          ])
        })
    })

    it('fires an app error if it cannot find the storage location', () => {
      noxy('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'pim': 'http://www.w3.org/ns/pim/space#'
          },
          '@error': {
            'type': 'HttpError',
            'message': 'Internal Server Error'
          }
        })

      return store.dispatch(Actions.createBookmarksContainer())
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_CONTAINER_REQUEST },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: `Couldn't install your bookmarks container`,
              message: 'Internal Server Error'
            }
          ])
        })
    })

    it('fires an app error if the creation fails', () => {
      noxy('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, {
          '@context': {
            'pim': 'http://www.w3.org/ns/pim/space#'
          },
          '@id': webId,
          'pim:storage': { '@id': 'https://localhost:8443/' }
        })
        .proxy('HEAD', '/Applications/mark/bookmarks/.config')
        .reply(404)
        .proxy('PUT', '/Applications/mark/bookmarks/.config')
        .reply(500)

      return store.dispatch(Actions.createBookmarksContainer())
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_CONTAINER_REQUEST },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: `Couldn't install your bookmarks container`,
              message: 'Internal Server Error'
            }
          ])
        })
    })
  })

  describe('saveBookmark', () => {
    it('updates a bookmark', () => {
      const id = 'https://localhost:8443/bookmark#b'
      const dc = 'http://purl.org/dc/elements/1.1/'
      const expectedPatchQuery =
        `DELETE DATA { <${id}> <${dc}title> "old" . };\n` +
        `INSERT DATA { <${id}> <${dc}title> "new" . };\n`

      noxy('https://localhost:8443/')
        .proxy('PATCH', '/bookmark', expectedPatchQuery)
        .reply(200)

      const oldBookmark = Immutable.fromJS({ '@id': `${id}`, 'dc:title': 'old' })
      const newBookmark = oldBookmark.set('dc:title', 'new')

      return store.dispatch(Actions.saveBookmark(oldBookmark, newBookmark))
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_SAVE_BOOKMARK_REQUEST },
            { type: AT.BOOKMARKS_SAVE_BOOKMARK_SUCCESS, bookmark: newBookmark }
          ])
        })
    })

    it('saves a new bookmark', () => {
      const id = 'https://localhost:8443/bookmark#b'
      const dc = 'http://purl.org/dc/elements/1.1/'
      const expectedPatchQuery =
        `INSERT DATA { <${id}> <${dc}title> "title" . };\n`

      noxy('https://localhost:8443/')
        .proxy('PATCH', '/bookmark', expectedPatchQuery)
        .reply(200)

      const bookmark = Immutable.fromJS({ '@id': `${id}`, 'dc:title': 'title' })

      return store.dispatch(Actions.saveBookmark(null, bookmark, true))
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_SAVE_BOOKMARK_REQUEST },
            { type: AT.BOOKMARKS_SAVE_BOOKMARK_SUCCESS, bookmark }
          ])
        })
    })

    it('fires an app error if the save fails', () => {
      const id = 'https://localhost:8443/bookmark#b'
      const dc = 'http://purl.org/dc/elements/1.1/'
      const expectedPatchQuery =
        `DELETE DATA { <${id}> <${dc}title> "old" . };\n` +
        `INSERT DATA { <${id}> <${dc}title> "new" . };\n`

      noxy('https://localhost:8443/')
        .proxy('PATCH', '/bookmark', expectedPatchQuery)
        .reply(500)

      const oldBookmark = Immutable.fromJS({ '@id': `${id}`, 'dc:title': 'old' })
      const newBookmark = oldBookmark.set('dc:title', 'new')

      return store.dispatch(Actions.saveBookmark(oldBookmark, newBookmark))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_SAVE_BOOKMARK_REQUEST },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: `Couldn't save your bookmark`,
              message: 'Internal Server Error'
            }
          ])
        })
    })
  })

  describe('loadBookmarks', () => {
    it('fetches the bookmarks resource and compiles a map of bookmark data', () => {
      const containerUrl = 'https://localhost:8443/Applications/mark/bookmarks/'
      const bookmarkJson = {
        '@id': 'https://localhost:8443/Applications/mark/bookmarks/0072a939-5b91-48d8-aeea-e0f085da95a0#bookmark',
        'dc:title': 'Github repo for Mark',
        'dc:description': { '@value': 'A mark description!' },
        'book:recalls': { '@id': 'https://github.com/dan-f/mark' },
        'solid:read': { '@value': 'false', '@type': 'http://www.w3.org/2001/XMLSchema#boolean' },
        'book:hasTopic': [ { '@value': 'github' }, { '@value': 'mark' } ]
      }
      const expectedBookmarks = Immutable.fromJS({
        'https://localhost:8443/Applications/mark/bookmarks/0072a939-5b91-48d8-aeea-e0f085da95a0#bookmark': bookmarkJson
      })
      const twinqlResponse = `{
        "@context": {
          "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          "book": "http://www.w3.org/2002/01/bookmark#",
          "dc": "http://purl.org/dc/elements/1.1/",
          "ldp": "http://www.w3.org/ns/ldp#",
          "solid": "http://www.w3.org/ns/solid/terms#"
        },
        "@id": "https://localhost:8443/Applications/mark/bookmarks/",
        "ldp:contains": [
          {
            "@id": "https://localhost:8443/Applications/mark/bookmarks/0072a939-5b91-48d8-aeea-e0f085da95a0",
            "@graph": [
              ${JSON.stringify(bookmarkJson)}
            ]
          }
        ]
      }`

      nock('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, twinqlResponse, { 'Content-Type': 'application/json+ld' })

      return store.dispatch(Actions.loadBookmarks(containerUrl))
        .then(() => {
          const actions = store.getActions()
          expect(actions.length).to.equal(2)
          expect(actions[0]).to.eql({ type: AT.BOOKMARKS_LOAD_LIST_REQUEST, url: containerUrl })
          expect(actions[1].type).to.eql(AT.BOOKMARKS_LOAD_LIST_SUCCESS)
          expect(actions[1].bookmarks).to.eql(expectedBookmarks)
        })
    })

    it('fires an app error if the loading fails', () => {
      nock('https://localhost:8443/')
        .post('/,twinql')
        .reply(200, { '@error': { type: 'HttpError', message: 'Internal Server Error' } })

      const containerUrl = 'https://localhost:8443/Applications/mark/bookmarks/'

      return store.dispatch(Actions.loadBookmarks(containerUrl))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_LOAD_LIST_REQUEST, url: containerUrl },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: `Couldn't load your bookmarks`,
              message: 'Internal Server Error'
            }
          ])
        })
    })
  })

  describe('createNew', () => {
    it('creates a new (empty) bookmark model', () => {
      store = mockStoreFactory({ bookmarksUrl: 'https://localhost:8443/bookmarks/' })
      store.dispatch(Actions.createNew())
      const actions = store.getActions()
      expect(actions.length).to.equal(1)
      expect(actions[0].type).to.equal(AT.BOOKMARKS_CREATE_NEW_BOOKMARK)
      expect(actions[0].bookmark.getIn(['rdf:type', '@id'])).to.equal('book:Bookmark')
    })
  })

  describe('createAndEditNew', () => {
    it('creates a new bookmark model and immediately edits it', () => {
      store = mockStoreFactory({ bookmarksUrl: 'https://localhost:8443/bookmarks/' })
      store.dispatch(Actions.createAndEditNew())
      const actions = store.getActions()
      expect(actions[0].type).to.equal(AT.BOOKMARKS_CREATE_NEW_BOOKMARK)
      expect(actions[1].type).to.equal(AT.BOOKMARKS_EDIT_BOOKMARK)
    })
  })

  describe('clearError', () => {
    it('tells the app to remove the current error', () => {
      store.dispatch(Actions.clearError())
      expect(store.getActions()).to.eql([
        { type: AT.BOOKMARKS_ALERT_CLEAR, kind: 'danger' }
      ])
    })
  })

  describe('cancelEdit', () => {
    it('tells the app to quit editing a bookmark', () => {
      store.dispatch(Actions.cancelEdit({}))
      expect(store.getActions()).to.eql([
        { type: AT.BOOKMARKS_EDIT_BOOKMARK_CANCEL, bookmark: {} }
      ])
    })
  })

  describe('addFilterTag', () => {
    it('tells the app to add a filter tag', () => {
      store.dispatch(Actions.addFilterTag('foo'))
      expect(store.getActions()).to.eql([
        { type: AT.BOOKMARKS_FILTER_ADD_TAG, tag: 'foo' }
      ])
    })
  })

  describe('removeFilterTag', () => {
    it('tells the app to remove a filter tag', () => {
      store.dispatch(Actions.removeFilterTag('foo'))
      expect(store.getActions()).to.eql([
        { type: AT.BOOKMARKS_FILTER_REMOVE_TAG, tag: 'foo' }
      ])
    })
  })

  describe('showArchived', () => {
    it('tells the app to show or hide archived bookmarks', () => {
      store.dispatch(Actions.showArchived(true))
      store.dispatch(Actions.showArchived(false))
      expect(store.getActions()).to.eql([
        { type: AT.BOOKMARKS_FILTER_TOGGLE_ARCHIVED, shown: true },
        { type: AT.BOOKMARKS_FILTER_TOGGLE_ARCHIVED, shown: false }
      ])
    })
  })

  describe('findEndpoints', () => {
    let assign

    beforeEach(() => {
      assign = mock()
      global.window = { location: { assign } }
      global.document = {
        origin: 'https://mark-app.biz',
        location: { href: 'https://mark-app.biz/some/route' }
      }
    })

    afterEach(() => {
      delete global.window
      delete global.document
    })

    it(`finds the user's endpoints`, () => {
      const login = 'https://localhost:8443/,account/login'
      const logout = 'https://localhost:8443/,account/logout'
      const twinql = 'https://localhost:8443/,query'
      const proxy = 'https://localhost:8443/,proxy?uri='
      nock('https://localhost:8443/')
        .options('/')
        .reply(200, '', {
          link: [
            `<${login}>; rel="http://solid.github.io/vocab/solid-terms.ttl#loginEndpoint"`,
            `<${logout}>; rel="http://solid.github.io/vocab/solid-terms.ttl#logoutEndpoint"`,
            `<${twinql}>; rel="http://solid.github.io/vocab/solid-terms.ttl#twinqlEndpoint"`,
            `<${proxy}>; rel="http://solid.github.io/vocab/solid-terms.ttl#proxyEndpoint"`
          ].join(',')
        })

      return store.dispatch(Actions.findEndpoints('https://localhost:8443/'))
        .then(() => {
          expect(store.getActions()).to.eql([
            {
              type: AT.BOOKMARKS_SAVE_ENDPOINTS,
              endpoints: { login, logout, twinql, proxy }
            }
          ])
        })
    })

    it('fires an application error if it cannot find the endpoints', () => {
      nock('https://localhost:8443/')
        .options('/')
        .reply(500)

      return store.dispatch(Actions.findEndpoints('https://localhost:8443/'))
        .catch(() => {
          expect(store.getActions()).to.eql([
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: `Couldn't find data needed to log in`,
              message: 'Internal Server Error'
            }
          ])
        })
    })
  })

  describe('saveCredentials', () => {
    /*
      In the index.js, a listener is set up to save the latest webId in
      localstorage.  Hence firing an auth success action is all it takes to
      'save' a webId for the returning user.
    */
    it('creates an auth success action with the given webId', () => {
      const webId = 'https://localhost:8443/profile/card#me'
      const key = 'qwertyuiop'
      store.dispatch(Actions.saveCredentials({ webId, key }))
      expect(store.getActions()).to.eql(
        [{ type: AT.BOOKMARKS_SAVE_AUTH_CREDENTIALS, webId, key }]
      )
    })
  })

  describe('saveLastIdp', () => {
    it('saves the last IDP', () => {
      const lastIdp = 'https://example.com/'
      store.dispatch(Actions.saveLastIdp(lastIdp))
      expect(store.getActions()).to.eql(
        [{ type: AT.BOOKMARKS_SAVE_LAST_IDP, lastIdp }]
      )
    })
  })
})
