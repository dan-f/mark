/* eslint-env mocha */
import nock from 'nock'

import { expect, mockStoreFactory, solidProfileFactory } from './common'
import * as Actions from '../src/actions'
import * as AT from '../src/actionTypes'

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
    store = mockStoreFactory()
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
        .head('/mark/bookmarks.ttl')
        .reply(404)
        .put('/mark/bookmarks.ttl')
        .reply(200)

      return store.dispatch(Actions.maybeInstallAppResources(solidProfile))
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: 'https://localhost:8443/mark/bookmarks.ttl' },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_REQUEST },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_SUCCESS },
            { type: AT.BOOKMARKS_SET_BOOKMARKS_URL, url: 'https://localhost:8443/mark/bookmarks.ttl' }
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
        .head('/mark/bookmarks.ttl')
        .reply(500)

      return store.dispatch(Actions.maybeInstallAppResources(solidProfile))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: 'https://localhost:8443/mark/bookmarks.ttl' },
            { type: AT.BOOKMARKS_ERROR_SET, errorMessage: 'Could not find the bookmarks file' }
          ])
        })
    })
  })

  describe('registerBookmarks', () => {
    it('respects the current bookmarks registration', () => {
      const registration = `
        <#registration> a solid:TypeRegistration ;
          solid:forClass bookmark:Bookmark ;
          solid:instance </path/to/bookmarks.ttl> .
      `

      nock('https://localhost:8443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle + registration, { 'Content-Type': 'text/turtle' })

      return store.dispatch(Actions.registerBookmarks(solidProfile))
        .then(bookmarksUrl => {
          expect(bookmarksUrl).to.equal('https://localhost:8443/path/to/bookmarks.ttl')
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
          const expectedBookmarksUrl = 'https://localhost:8443/mark/bookmarks.ttl'
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
            { type: AT.BOOKMARKS_ERROR_SET, errorMessage: 'Could not register bookmarks in the type index' }
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
            { type: AT.BOOKMARKS_ERROR_SET, errorMessage: 'Could not load the type index' }
          ])
        })
    })
  })

  describe('createBookmarksResource', () => {
    it('creates the bookmarks solid resource', () => {
      nock('https://localhost:8443/')
        .put('/path/to/bookmarks.ttl')
        .reply(200)

      return store.dispatch(Actions.createBookmarksResource('https://localhost:8443/path/to/bookmarks.ttl'))
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_RESOURCE_REQUEST },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_SUCCESS }
          ])
        })
    })

    it('fires an app error if the creation fails', () => {
      nock('https://localhost:8443/')
        .put('/path/to/bookmarks.ttl')
        .reply(500)

      return store.dispatch(Actions.createBookmarksResource('https://localhost:8443/path/to/bookmarks.ttl'))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_CREATE_RESOURCE_REQUEST },
            {
              type: AT.BOOKMARKS_ERROR_SET,
              errorMessage: 'Could not create bookmarks file'
            }
          ])
        })
    })
  })

  describe('saveBookmark', () => {
    it('saves a bookmark')

    it('fires an app error if the save fails')
  })

  describe('loadBookmarks', () => {
    it('fetches the bookmarks resource and creates a map of bookmark models')

    it('fires an app error if the loading fails')
  })

  describe('createNew', () => {
    it('creates a new (empty) bookmark model', () => {
      const webId = 'https://localhost:8443/profile/card#me'
      const action = Actions.createNew(webId)
      expect(action.type).to.equal(AT.BOOKMARKS_CREATE_NEW_BOOKMARK)
      expect(action.bookmark.any('type')).to.equal('http://www.w3.org/2002/01/bookmark#Bookmark')
    })
  })
})
