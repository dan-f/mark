/* eslint-env mocha */
import Immutable from 'immutable'

import { expect, MockLocalStorage } from './common'
import * as AT from '../src/actionTypes'
import * as Reducers from '../src/reducers'

describe('Reducers', () => {
  beforeEach(() => {
    global.localStorage = new MockLocalStorage()
  })

  afterEach(() => {
    delete global.localStorage
  })

  function testUnrecognizedAction (reducer, initialState) {
    const action = { type: 'UNRECOGNIZED_ACTION' }
    expect(reducer(initialState, action)).to.eql(initialState)
  }

  describe('auth', () => {
    it('saves auth credentials', () => {
      const webId = 'https://localhost:8443/profile/card#me'
      const key = 'abc123'
      expect(
        Reducers.auth({}, {
          type: AT.BOOKMARKS_SAVE_AUTH_CREDENTIALS,
          webId,
          key
        })
      ).to.eql({ webId, key })
    })

    it('clears auth credentials', () => {
      expect(
        Reducers.auth({
          webId: 'https://localhost:8443/profile/card#me',
          key: 'abc123'
        }, { type: AT.BOOKMARKS_CLEAR_AUTH_CREDENTIALS })
      ).to.eql({ webId: null, key: null })
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.auth, {
        webId: 'https://localhost:8443/profile/card#me',
        key: 'abc123'
      })
    })
  })

  describe('profile', () => {
    it('saves the profile after loading', () => {
      const profile = { 'foaf:img': 'https://example.com/img.jpg' }
      expect(
        Reducers.profile(undefined, { type: AT.BOOKMARKS_LOAD_PROFILE_SUCCESS, profile })
      ).to.eql({ 'foaf:img': 'https://example.com/img.jpg' })
    })

    it('clears the profile', () => {
      const profile = { 'foaf:img': 'https://example.com/img.jpg' }
      expect(
        Reducers.profile(profile, { type: AT.BOOKMARKS_CLEAR_PROFILE })
      ).to.eql({ 'foaf:img': '/solid-logo.svg' })
    })

    it('ignores unrecognized actions', () => {
      const profile = { 'foaf:img': 'https://example.com/img.jpg' }
      testUnrecognizedAction(Reducers.profile, profile)
    })
  })

  describe('endpoints', () => {
    const endpoints = {
      login: 'https://localhost:8443/,login',
      logout: 'https://localhost:8443/,logout',
      proxy: 'https://localhost:8443/,proxy?uri=',
      twinql: 'https://localhost:8443/,query'
    }

    it('saves endpoints', () => {
      expect(
        Reducers.endpoints({}, {
          type: AT.BOOKMARKS_SAVE_ENDPOINTS,
          endpoints
        })
      ).to.eql(endpoints)
    })

    it('clears endpoints', () => {
      expect(
        Reducers.endpoints(endpoints, { type: AT.BOOKMARKS_CLEAR_ENDPOINTS })
      ).to.eql({
        login: null,
        logout: null,
        proxy: null,
        twinql: 'https://databox.me/,query'
      })
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.auth, endpoints)
    })
  })

  describe('bookmarks', () => {
    const makeBookmark = () => Immutable.fromJS({
      '@id': 'https://localhost:8443/bookmarks.ttl#test-bookmark',
      'dc:title': '',
      'dc:description': '',
      'book:recalls': '',
      'book:hasTopic': [],
      'solid:read': false
    })

    it('sets the bookmarks after a successful load', () => {
      const bookmark = makeBookmark()
      const actionBookmarks = Immutable.fromJS({
        [bookmark.get('@id')]: bookmark
      })
      const expectedBookmarks = Immutable.fromJS({
        [bookmark.get('@id')]: { isEditing: false, isNew: false, data: bookmark }
      })
      const action = { type: AT.BOOKMARKS_LOAD_SUCCESS, bookmarks: actionBookmarks }
      expect(Reducers.bookmarks(undefined, action)).to.eql(expectedBookmarks)
    })

    it('adds a bookmark after a successful save', () => {
      const bookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_SAVE_BOOKMARK_SUCCESS, bookmark }
      const nextState = Reducers.bookmarks(undefined, action)
      expect(nextState.size).to.equal(1)
      expect(nextState.get(bookmark.get('@id'))).to.eql(Immutable.fromJS({
        data: bookmark,
        isEditing: false,
        isNew: false
      }))
    })

    it('replaces a bookmark after a successful save', () => {
      const oldBookmark = makeBookmark()
      const newBookmark = oldBookmark.set('dc:title', 'new title')
      const action = { type: AT.BOOKMARKS_SAVE_BOOKMARK_SUCCESS, bookmark: newBookmark }
      const state = Immutable.fromJS({
        [oldBookmark.get('@id')]: {
          data: oldBookmark,
          isEditing: true,
          isNew: true
        }
      })
      const nextState = Reducers.bookmarks(state, action)
      expect(nextState.size).to.equal(1)
      expect(nextState.get(newBookmark.get('@id'))).to.eql(Immutable.fromJS({
        data: newBookmark,
        isEditing: false,
        isNew: false
      }))
    })

    it('marks bookmarks as edited', () => {
      const bookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_EDIT_BOOKMARK, bookmark }
      const state = Immutable.fromJS({
        [bookmark.get('@id')]: {
          data: bookmark,
          isEditing: false,
          isNew: false
        }
      })
      const nextState = Reducers.bookmarks(state, action)
      expect(nextState.size).to.equal(1)
      expect(nextState.get(bookmark.get('@id'))).to.eql(Immutable.fromJS({
        data: bookmark,
        isEditing: true,
        isNew: false
      }))
    })

    it('removes a new/unsaved bookmark when editing is cancelled', () => {
      const tempBookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_EDIT_BOOKMARK_CANCEL, bookmark: tempBookmark }
      const state = Immutable.fromJS({
        [tempBookmark.get('@id')]: {
          data: tempBookmark,
          isEditing: true,
          isNew: true
        }
      })
      const nextState = Reducers.bookmarks(state, action)
      expect(nextState.size).to.equal(0)
    })

    it('cancels a saved bookmark from being edited', () => {
      const bookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_EDIT_BOOKMARK_CANCEL, bookmark }
      const state = Immutable.fromJS({
        [bookmark.get('@id')]: {
          data: bookmark,
          isEditing: true,
          isNew: false
        }
      })
      const nextState = Reducers.bookmarks(state, action)
      expect(nextState.size).to.equal(1)
      expect(nextState.get(bookmark.get('@id'))).to.eql(Immutable.fromJS({
        data: bookmark,
        isEditing: false,
        isNew: false
      }))
    })

    it('adds a new bookmark to the set', () => {
      const bookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_CREATE_NEW_BOOKMARK, bookmark }
      const state = Reducers.bookmarks(state, action)
      expect(state.get(bookmark.get('@id'))).to.eql(Immutable.fromJS({
        data: bookmark,
        isEditing: false,
        isNew: true
      }))
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.bookmarks, Immutable.Map())
      testUnrecognizedAction(Reducers.bookmarks, Immutable.Map({foo: 'bar'}))
    })
  })

  describe('selectedTags', () => {
    it('adds tags to the selected set', () => {
      const action = { type: AT.BOOKMARKS_FILTER_ADD_TAG, tag: 'a tag' }
      expect(
        Reducers.selectedTags(undefined, action).equals(Immutable.Set(['a tag']))
      ).to.be.true
    })

    it('adds no more than one of each tag', () => {
      const action = { type: AT.BOOKMARKS_FILTER_ADD_TAG, tag: 'a tag' }
      const state = Immutable.Set(['a tag'])
      expect(
        Reducers.selectedTags(state, action).equals(Immutable.Set(['a tag']))
      ).to.be.true
    })

    it('removes tags from the selected set', () => {
      const action = { type: AT.BOOKMARKS_FILTER_REMOVE_TAG, tag: 'a tag' }
      const state = Immutable.Set(['a tag'])
      expect(
        Reducers.selectedTags(state, action).isEmpty()
      ).to.be.true
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.selectedTags, Immutable.Set(['foo', 'bar']))
    })
  })

  describe('showArchived', () => {
    it('flips the showArchived boolean to true or false', () => {
      const trueAction = { type: AT.BOOKMARKS_FILTER_TOGGLE_ARCHIVED, shown: true }
      const falseAction = { type: AT.BOOKMARKS_FILTER_TOGGLE_ARCHIVED, shown: false }
      expect(Reducers.showArchived(false, trueAction)).to.be.true
      expect(Reducers.showArchived(true, falseAction)).to.be.false
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.showArchived, false)
      testUnrecognizedAction(Reducers.showArchived, true)
    })
  })

  describe('alerts', () => {
    it('sets the alert', () => {
      const action = {
        type: AT.BOOKMARKS_ALERT_SET,
        kind: 'danger',
        heading: 'Uh oh',
        message: 'Example error message'
      }
      expect(Reducers.alerts(Immutable.Map(), action).get('danger')).to.eql({
        heading: 'Uh oh',
        message: 'Example error message'
      })
    })

    it('clears the alert', () => {
      const action = { type: AT.BOOKMARKS_ALERT_CLEAR, kind: 'danger' }
      expect(Reducers.alerts(
        Immutable.Map({ 'danger': { heading: 'a fantastic heading', message: 'the best message' } }),
        action
      ).get('danger')).to.be.undefined
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.alerts, 'current state')
    })
  })
})
