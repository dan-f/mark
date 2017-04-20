/* eslint-env mocha */
const path = require('path')

import nock from 'nock'
import { rdflib } from 'solid-client'

import { expect, MockLocalStorage, mockStoreFactory, profileTurtle, solidProfileFactory } from './common'
import * as Actions from '../src/actions'
import * as AT from '../src/actionTypes'
import { bookmarkModelFactory } from '../src/models'

describe('Actions', () => {
  const typeRegistryTurtle = `
    @prefix solid: <http://www.w3.org/ns/solid/terms#> .
    @prefix bookmark: <http://www.w3.org/2002/01/bookmark#> .

    <> a solid:ListedDocument ;
      a solid:TypeIndex .
  `
  let solidProfile
  let store

  beforeEach(() => {
    solidProfile = solidProfileFactory()
    store = mockStoreFactory({ profile: solidProfileFactory() })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('maybeInstallAppResources', () => {
    it('registers bookmarks in the type index and sets the bookmarks url', () => {
      nock('https://localhost:8443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle, { 'Content-Type': 'text/turtle' })
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle, { 'Content-Type': 'text/turtle' })
        .patch('/profile/publicTypeIndex.ttl')
        .reply(200)
        .head('/application-data/mark/bookmarks/')
        .reply(404)
        .post('/application-data/mark/bookmarks/')
        .reply(200)

      return store.dispatch(Actions.maybeInstallAppResources(solidProfile))
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: 'https://localhost:8443/application-data/mark/bookmarks/' },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_REQUEST },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_SUCCESS },
            { type: AT.BOOKMARKS_SET_BOOKMARKS_URL, url: 'https://localhost:8443/application-data/mark/bookmarks/' }
          ])
        })
    })

    it('fires an app error if the bookmarks resource cannot be found', () => {
      nock('https://localhost:8443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle, { 'Content-Type': 'text/turtle' })
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle, { 'Content-Type': 'text/turtle' })
        .patch('/profile/publicTypeIndex.ttl')
        .reply(200)
        .head('/mark/bookmarks/')
        .reply(500)

      return store.dispatch(Actions.maybeInstallAppResources(solidProfile))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: 'https://localhost:8443/application-data/mark/bookmarks/' },
            { type: AT.BOOKMARKS_ALERT_SET, kind: 'danger', heading: 'Could not find the bookmarks file' }
          ])
        })
    })
  })

  describe('registerBookmarks', () => {
    it('respects the current bookmarks registration', () => {
      const registration = `
        <#registration> a solid:TypeRegistration ;
          solid:forClass bookmark:Bookmark ;
          solid:instanceContainer </path/to/bookmarks/> .
      `

      nock('https://localhost:8443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle + registration, { 'Content-Type': 'text/turtle' })

      return store.dispatch(Actions.registerBookmarks(solidProfile))
        .then(bookmarksUrl => {
          expect(bookmarksUrl).to.equal('https://localhost:8443/path/to/bookmarks/')
          expect(store.getActions()).to.eql([])
        })
    })

    it('registers bookmarks in the type index if no registration exists', () => {
      nock('https://localhost:8443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle, { 'Content-Type': 'text/turtle' })
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle, { 'Content-Type': 'text/turtle' })
        .patch('/profile/publicTypeIndex.ttl')
        .reply(200)

      return store.dispatch(Actions.registerBookmarks(solidProfile))
        .then(bookmarksUrl => {
          const expectedBookmarksUrl = 'https://localhost:8443/application-data/mark/bookmarks/'
          expect(bookmarksUrl).to.equal(expectedBookmarksUrl)
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: expectedBookmarksUrl }
          ])
        })
    })

    it('fires an app error if the bookmarks type index registration fails', () => {
      nock('https://localhost:8443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle, { 'Content-Type': 'text/turtle' })
        .patch('/profile/publicTypeIndex.ttl')
        .reply(500)

      return store.dispatch(Actions.registerBookmarks(solidProfile))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_ALERT_SET, kind: 'danger', heading: 'Could not register bookmarks in the type index' }
          ])
        })
    })

    it('fires an app error if the type index fails to load', () => {
      nock('https://localhost:8443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(500)

      return store.dispatch(Actions.registerBookmarks(solidProfile))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_ALERT_SET, kind: 'danger', heading: 'Could not load the type index' }
          ])
        })
    })
  })

  describe('createBookmarksResource', () => {
    it('creates the bookmarks solid resource', () => {
      nock('https://localhost:8443/')
        .post('/path/to/bookmarks/')
        .reply(200)

      return store.dispatch(Actions.createBookmarksResource('https://localhost:8443/path/to/bookmarks/'))
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_RESOURCE_REQUEST },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_SUCCESS }
          ])
        })
    })

    it('fires an app error if the creation fails', () => {
      nock('https://localhost:8443/')
        .post('/path/to/bookmarks/')
        .reply(500)

      return store.dispatch(Actions.createBookmarksResource('https://localhost:8443/path/to/bookmarks/'))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_RESOURCE_REQUEST },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: 'Could not create bookmarks file'
            }
          ])
        })
    })
  })

  describe('saveBookmark', () => {
    const graph = rdflib.graph()
    const namedGraph = 'https://localhost:8443/mark/bookmarks/bookmark.ttl'
    const subject = rdflib.NamedNode.fromValue(`${namedGraph}#SomeBookmark`)
    const bookmark = bookmarkModelFactory(graph, namedGraph, subject)

    it('saves a bookmark', () => {
      nock('https://localhost:8443/')
        .patch('/mark/bookmarks/bookmark.ttl')
        .reply(200)

      return store.dispatch(Actions.saveBookmark(bookmark))
        .then(() => {
          const actions = store.getActions()
          expect(actions.length).to.equal(2)
          expect(actions[0]).to.eql({ type: AT.BOOKMARKS_SAVE_BOOKMARK_REQUEST })
          expect(actions[1].type).to.equal(AT.BOOKMARKS_SAVE_BOOKMARK_SUCCESS)
        })
    })

    it('fires an app error if the save fails', () => {
      nock('https://localhost:8443/')
        .patch('/mark/bookmarks/bookmark.ttl')
        .reply(500)

      return store.dispatch(Actions.saveBookmark(bookmark))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_SAVE_BOOKMARK_REQUEST },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: 'Could not save your bookmark'
            }
          ])
        })
    })
  })

  describe('loadBookmarks', () => {
    it('fetches the bookmarks resource and creates a map of bookmark models', () => {
      const bookmarksTurtle = `
        @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
        @prefix bookmark: <http://www.w3.org/2002/01/bookmark#> .
        @prefix dc: <http://purl.org/dc/elements/1.1/> .

        <bookmark.ttl#ExampleBookmark>
            dc:description "An example bookmark" ;
            dc:title "Example Bookmark" ;
            a bookmark:Bookmark ;
            bookmark:hasTopic "foo", "bar" ;
            bookmark:recalls <http://example.com/> .
      `

      nock('https://localhost:8443/')
        .get('/mark/bookmarks/*')
        .reply(200, bookmarksTurtle, { 'Content-Type': 'text/turtle' })

      const url = 'https://localhost:8443/mark/bookmarks/'

      return store.dispatch(Actions.loadBookmarks(url))
        .then(() => {
          const actions = store.getActions()
          expect(actions.length).to.equal(2)
          expect(actions[0]).to.eql({ type: AT.BOOKMARKS_LOAD_REQUEST, url })
          expect(actions[1].type).to.equal(AT.BOOKMARKS_LOAD_SUCCESS)
          expect([...actions[1].bookmarks.keys()]).to.eql([
            'https://localhost:8443/mark/bookmarks/bookmark.ttl#ExampleBookmark'
          ])
        })
    })

    it('fires an app error if the loading fails', () => {
      nock('https://localhost:8443/')
        .get('/mark/bookmarks/*')
        .reply(500)

      const url = 'https://localhost:8443/mark/bookmarks/ '

      return store.dispatch(Actions.loadBookmarks(url))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_LOAD_REQUEST, url },
            {
              type: AT.BOOKMARKS_ALERT_SET,
              kind: 'danger',
              heading: 'Could not load your bookmarks'
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
      expect(actions[0].bookmark.any('type')).to.equal('http://www.w3.org/2002/01/bookmark#Bookmark')
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

  describe('login', () => {
    beforeEach(() => {
      global.localStorage = new MockLocalStorage()
    })

    afterEach(() => {
      delete global.localStorage
    })

    it('discovers the current user and loads their profile', () => {
      const webId = 'https://localhost:8443/profile/card#me'
      nock('https://localhost:8443/')
        .head('/')
        .reply(200, '', { user: webId })
        .get('/profile/card')
        .reply(200, profileTurtle, { 'Content-Type': 'text/turtle' })

      return store.dispatch(Actions.login({
        authEndpoint: 'https://localhost:8443/',
        cert: path.join(__dirname, '/data/cert.pem'),
        key: path.join(__dirname, '/data/key.pem')
      })).then(() => {
        const [ authRequest, authSuccess, loadProfileRequest, loadProfileSuccess ] = store.getActions()
        expect(authRequest).to.eql({ type: 'AUTH_REQUEST' })
        expect(authSuccess).to.eql({
          type: 'AUTH_SUCCESS',
          webId: 'https://localhost:8443/profile/card#me'
        })
        expect(loadProfileRequest).to.eql({ type: AT.BOOKMARKS_LOAD_PROFILE_REQUEST })
        expect(loadProfileSuccess.type).to.equal(AT.BOOKMARKS_LOAD_PROFILE_SUCCESS)
        expect(loadProfileSuccess.profile.parsedGraph.statements)
          .to.eql(solidProfileFactory().parsedGraph.statements)
      })
    })

    it('tries to discover the current user from localStorage', () => {
      global.localStorage.setItem('mark', JSON.stringify({ webId: 'https://localhost:8443/profile/card#me' }))
      nock('https://localhost:8443/')
        .get('/profile/card')
        .reply(200, profileTurtle, { 'Content-Type': 'text/turtle' })

      return store.dispatch(Actions.login({
        authEndpoint: 'https://localhost:8443/',
        cert: path.join(__dirname, '/data/cert.pem'),
        key: path.join(__dirname, '/data/key.pem')
      })).then(() => {
        const actions = store.getActions()
        expect(actions.map(act => act.type)).to.eql([AT.BOOKMARKS_LOAD_PROFILE_REQUEST, AT.BOOKMARKS_LOAD_PROFILE_SUCCESS])
        expect(localStorage.getItem).to.have.been.calledWith('mark')
      })
    })

    it('alerts the user if an error occurs during authentication', () => {
      nock('https://localhost:8443/')
        .head('/')
        .socketDelay(0)

      nock('https://databox.me/')
        .head('/')
        .socketDelay(0)

      return store.dispatch(Actions.login({
        authEndpoint: 'https://localhost:8443/',
        cert: path.join(__dirname, '/data/cert.pem'),
        key: path.join(__dirname, '/data/key.pem')
      })).catch(() => {
        expect(store.getActions().map(act => act.type)).to.eql(['AUTH_REQUEST', 'AUTH_FAILURE', 'BOOKMARKS_ALERT_SET'])
      })
    })

    it('resolves to null if it cannot log in', () => {
      nock('https://localhost:8443/')
        .head('/')
        .reply(500)

      nock('https://databox.me/')
        .head('/')
        .reply(500)

      return store.dispatch(Actions.login({
        authEndpoint: 'https://localhost:8443/',
        cert: path.join(__dirname, '/data/cert.pem'),
        key: path.join(__dirname, '/data/key.pem')
      })).then(webId => {
        expect(webId).to.be.null
      })
    })

    it('throws an error if loading the profile fails', () => {
      const webId = 'https://localhost:8443/profile/card#me'
      nock('https://localhost:8443/')
        .head('/')
        .reply(200, '', { user: webId })
        .get('/profile/card')
        .reply(500)

      return store.dispatch(Actions.login({
        authEndpoint: 'https://localhost:8443/',
        cert: path.join(__dirname, '/data/cert.pem'),
        key: path.join(__dirname, '/data/key.pem')
      })).catch(() => {
        expect(store.getActions()).to.eql([
          { type: 'AUTH_REQUEST' },
          { type: 'AUTH_SUCCESS',
            webId: 'https://localhost:8443/profile/card#me' },
          { type: 'BOOKMARKS_LOAD_PROFILE_REQUEST' },
          { type: 'BOOKMARKS_ALERT_SET',
            kind: 'danger',
            heading: 'Couldn\'t load your profile' }
        ])
      })
    })
  })

  describe('saveWebId', () => {
    /*
      In the index.js, a listener is set up to save the latest webId in
      localstorage.  Hence firing an auth success action is all it takes to
      'save' a webId for the returning user.
    */
    it('creates an auth success action with the given webId', () => {
      const webId = 'https://localhost:8443/profile/card#me'
      store.dispatch(Actions.saveWebId(webId))
      expect(store.getActions()).to.eql(
        [{ type: 'AUTH_SUCCESS', webId }]
      )
    })
  })
})
