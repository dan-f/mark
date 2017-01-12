import * as Immutable from 'immutable'
import { combineReducers } from 'redux'
import auth from 'redux-solid-auth/lib/reducers'

import * as ActionTypes from './actionTypes'

export function bookmarks (state = Immutable.Map(), action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_LOAD_SUCCESS:
      return action.bookmarks
    case ActionTypes.BOOKMARKS_SAVE_BOOKMARK_SUCCESS:
      return state.set(action.bookmark.subject.value, {
        model: action.bookmark,
        isEditing: false,
        isNew: false
      })
    case ActionTypes.BOOKMARKS_EDIT_BOOKMARK_CANCEL:
      return state.get(action.bookmark.subject.value).isNew
        ? state.remove(action.bookmark.subject.value)
        : state.set(action.bookmark.subject.value, {
          model: action.bookmark,
          isEditing: false,
          isNew: false
        })
    case ActionTypes.BOOKMARKS_EDIT_BOOKMARK:
      return state.set(action.bookmark.subject.value, {
        model: action.bookmark,
        isEditing: true,
        isNew: state.get(action.bookmark.subject.value).isNew
      })
    case ActionTypes.BOOKMARKS_CREATE_NEW_BOOKMARK:
      return state.set(action.bookmark.subject.value, {
        model: action.bookmark,
        isEditing: false,
        isNew: true
      })
    default:
      return state
  }
}

export function bookmarksUrl (state = '', action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_SET_BOOKMARKS_URL:
      return action.url
    default:
      return state
  }
}

export function selectedTags (state = Immutable.Set(), action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_FILTER_ADD_TAG:
      return state.add(action.tag)
    case ActionTypes.BOOKMARKS_FILTER_REMOVE_TAG:
      return state.remove(action.tag)
    default:
      return state
  }
}

export function showArchived (state = false, action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_FILTER_TOGGLE_ARCHIVED:
      return action.shown
    default:
      return state
  }
}

const filters = combineReducers({selectedTags, showArchived})

export function error (state = '', action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_ERROR_SET:
      return action.errorMessage
    case ActionTypes.BOOKMARKS_ERROR_CLEAR:
      return ''
    default:
      return state
  }
}

export default combineReducers({
  auth,
  bookmarks,
  bookmarksUrl,
  filters,
  error
})
