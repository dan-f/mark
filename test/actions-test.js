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
      nock('https://example.com/')
        .head('/mark/bookmarks.ttl')
        .reply(404)
        .patch('/profile/publicTypeIndex.ttl')
        .reply(200)
        .put('/mark/bookmarks.ttl')
        .reply(200)

      const store = mockStoreFactory()
      const solidProfile = solidProfileFactory()

      return store.dispatch(Actions.maybeInstallAppResources(solidProfile))
        .then(() => {
          expect(store.getActions()).to.eql([
            { type: AT.BOOKMARKS_REGISTER_REQUEST },
            { type: AT.BOOKMARKS_REGISTER_SUCCESS, bookmarksUrl: 'https://example.com/mark/bookmarks.ttl' },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_REQUEST },
            { type: AT.BOOKMARKS_CREATE_RESOURCE_SUCCESS },
            { type: AT.BOOKMARKS_SET_BOOKMARKS_URL, url: 'https://example.com/mark/bookmarks.ttl' }
          ])
        })
    })

    it('creates the bookmarks resource if it does not already exist')

    it('fires an app error if the bookmarks file cannot be found')

    it('sets the bookmark url once everything is installed')
  })

  describe('registerBookmarks', () => {
    it('registers bookmarks in the type index')

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
      const webId = 'https://example.com/profile/card#me'
      const action = Actions.createNew(webId)
      expect(action.type).to.equal(AT.BOOKMARKS_CREATE_NEW_BOOKMARK)
      expect(action.bookmark.any('type')).to.equal('http://www.w3.org/2002/01/bookmark#Bookmark')
    })
  })
})
