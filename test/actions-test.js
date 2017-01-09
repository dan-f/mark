/* eslint-env mocha */
import nock from 'nock'

import { expect, mockStoreFactory, solidProfileFactory } from './common'
import * as Actions from '../src/actions'
import * as AT from '../src/actionTypes'

describe('Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('maybeInstallAppResources', () => {
    it('registers bookmarks in the type index and sets the bookmarks url', () => {
      nock('https://localhost:443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200)
        .patch('/profile/publicTypeIndex.ttl')
        .reply(200)
        .head('/mark/bookmarks.ttl')
        .reply(404)
        .put('/mark/bookmarks.ttl')
        .reply(200)

      const solidProfile = solidProfileFactory()
      const store = mockStoreFactory()

      return store.dispatch(Actions.maybeInstallAppResources(solidProfile))
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: 'https://localhost:443/mark/bookmarks.ttl' },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_REQUEST },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_SUCCESS },
            { type: AT.BOOKMARKS_SET_BOOKMARKS_URL, url: 'https://localhost:443/mark/bookmarks.ttl' }
          ])
        })
    })

    it('fires an app error if the bookmarks resource cannot be found', () => {
      nock('https://localhost:443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200)
        .patch('/profile/publicTypeIndex.ttl')
        .reply(200)
        .head('/mark/bookmarks.ttl')
        .reply(500)

      const solidProfile = solidProfileFactory()
      const store = mockStoreFactory()

      return store.dispatch(Actions.maybeInstallAppResources(solidProfile))
        .catch(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: 'https://localhost:443/mark/bookmarks.ttl' },
            { type: AT.BOOKMARKS_ERROR_SET, errorMessage: 'Could not find the bookmarks file' }
          ])
        })
    })
  })

  describe('registerBookmarks', () => {
    it('respects the current bookmarks registration', () => {
      const typeRegistryTurtle = `
        @prefix solid: <http://www.w3.org/ns/solid/terms#> .
        @prefix bookmark: <http://www.w3.org/2002/01/bookmark#> .

        <> a solid:ListedDocument ;
          a solid:TypeIndex .

        <#registration> a solid:TypeRegistration ;
          solid:forClass bookmark:Bookmark ;
          solid:instance </path/to/bookmarks.ttl> .
      `
      nock('https://localhost:443/')
        .get('/profile/publicTypeIndex.ttl')
        .reply(200, typeRegistryTurtle, { 'Content-Type': 'text/turtle' })

      const solidProfile = solidProfileFactory()
      const store = mockStoreFactory()

      return store.dispatch(Actions.registerBookmarks(solidProfile))
        .then(bookmarksUrl => {
          expect(bookmarksUrl).to.equal('https://localhost:443/path/to/bookmarks.ttl')
          expect(store.getActions()).to.eql([])
        })
    })

    it('registers bookmarks in the type index if no registration exists')

    it('fires an app error if the registration fails')
  })

  describe('createBookmarksResource', () => {
    it('creates the bookmarks solid resource')

    it('fires an app error if the creation fails')
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
      const webId = 'https://localhost:443/profile/card#me'
      const action = Actions.createNew(webId)
      expect(action.type).to.equal(AT.BOOKMARKS_CREATE_NEW_BOOKMARK)
      expect(action.bookmark.any('type')).to.equal('http://www.w3.org/2002/01/bookmark#Bookmark')
    })
  })
})
