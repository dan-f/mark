/* eslint-env mocha */
import Immutable from 'immutable'

import { expect } from './common'
import * as AT from '../src/actionTypes'
import * as Reducers from '../src/reducers'

describe('Reducers', () => {
  function testUnrecognizedAction (reducer, initialState) {
    const action = { type: 'UNRECOGNIZED_ACTION' }
    expect(reducer(initialState, action)).to.eql(initialState)
  }

  describe('profile', () => {
    it('has an initially null state', () => {
      expect(Reducers.profile(undefined, {})).to.be.null
    })

    it('updates its state on a successful profile load action', () => {
      const profile = { foo: 'bar' }
      expect(Reducers.profile(undefined, { type: AT.BOOKMARKS_LOAD_PROFILE_SUCCESS, profile }))
        .to.eql(profile)
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.profile, 'current state')
    })
  })

  describe('bookmarks', () => {
    function makeBookmark () {
      return {
        subject: {
          value: `https://localhost:8443/bookmarks.ttl#test-bookmark`
        }
      }
    }

    it('sets the bookmarks after a successful load', () => {
      const bookmark = makeBookmark()
      const bookmarks = Immutable.Map({
        [bookmark.subject.value]: { model: bookmark, isEditing: false }
      })
      const action = { type: AT.BOOKMARKS_LOAD_SUCCESS, bookmarks }
      expect(Reducers.bookmarks(undefined, action)).to.eql(bookmarks)
    })

    it('adds a bookmark after a successful save', () => {
      const bookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_SAVE_BOOKMARK_SUCCESS, bookmark }
      const nextState = Reducers.bookmarks(undefined, action)
      expect(nextState.size).to.equal(1)
      expect(nextState.get(bookmark.subject.value)).to.eql({
        model: bookmark,
        isEditing: false,
        isNew: false
      })
    })

    it('replaces a bookmark after a successful save', () => {
      const oldBookmark = makeBookmark()
      const newBookmark = { ...oldBookmark, extra: 'foo' }
      const action = { type: AT.BOOKMARKS_SAVE_BOOKMARK_SUCCESS, bookmark: newBookmark }
      const state = Immutable.Map({
        [oldBookmark.subject.value]: {
          model: oldBookmark,
          isEditing: true,
          isNew: true
        }
      })
      const nextState = Reducers.bookmarks(state, action)
      expect(nextState.size).to.equal(1)
      expect(nextState.get(newBookmark.subject.value)).to.eql({
        model: newBookmark,
        isEditing: false,
        isNew: false
      })
    })

    it('marks bookmarks as edited', () => {
      const bookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_EDIT_BOOKMARK, bookmark }
      const state = Immutable.Map({
        [bookmark.subject.value]: {
          model: bookmark,
          isEditing: false,
          isNew: false
        }
      })
      const nextState = Reducers.bookmarks(state, action)
      expect(nextState.size).to.equal(1)
      expect(nextState.get(bookmark.subject.value)).to.eql({
        model: bookmark,
        isEditing: true,
        isNew: false
      })
    })

    it('removes a new/unsaved bookmark when editing is cancelled', () => {
      const tempBookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_EDIT_BOOKMARK_CANCEL, bookmark: tempBookmark }
      const state = Immutable.Map({
        [tempBookmark.subject.value]: {
          model: tempBookmark,
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
      const state = Immutable.Map({
        [bookmark.subject.value]: {
          model: bookmark,
          isEditing: true,
          isNew: false
        }
      })
      const nextState = Reducers.bookmarks(state, action)
      expect(nextState.size).to.equal(1)
      expect(nextState.get(bookmark.subject.value)).to.eql({
        model: bookmark,
        isEditing: false,
        isNew: false
      })
    })

    it('adds a new bookmark to the set', () => {
      const bookmark = makeBookmark()
      const action = { type: AT.BOOKMARKS_CREATE_NEW_BOOKMARK, bookmark }
      const state = Reducers.bookmarks(state, action)
      expect(state.get(bookmark.subject.value)).to.eql({
        model: bookmark,
        isEditing: false,
        isNew: true
      })
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.bookmarks, Immutable.Map())
      testUnrecognizedAction(Reducers.bookmarks, Immutable.Map({foo: 'bar'}))
    })
  })

  describe('bookmarksUrl', () => {
    it('sets the URL of the bookmarks resource', () => {
      const url = 'https://localhost:8443/path/to/bookmarks.ttl'
      const action = { type: AT.BOOKMARKS_SET_BOOKMARKS_URL, url }
      expect(Reducers.bookmarksUrl(undefined, action)).to.equal(url)
    })

    it('ignores unrecognized actions', () => {
      testUnrecognizedAction(Reducers.bookmarksUrl, '')
      testUnrecognizedAction(Reducers.bookmarksUrl, 'https://localhost:8443/mark/bookmarks.ttl')
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
