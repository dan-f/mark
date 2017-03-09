import * as Immutable from 'immutable'
import { combineReducers } from 'redux'
import auth from 'redux-solid-auth/lib/reducers'

import * as ActionTypes from './actionTypes'

export function profile (state = {}, action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_LOAD_PROFILE_SUCCESS:
      return action.profile
    default:
      return state
  }
}

export function bookmarks (state = Immutable.Map(), action) {
  const subject = action.bookmark && action.bookmark.subject && action.bookmark.subject.value
  switch (action.type) {
    case ActionTypes.BOOKMARKS_LOAD_SUCCESS:
      return action.bookmarks
    case ActionTypes.BOOKMARKS_SAVE_BOOKMARK_SUCCESS:
      return state.mergeDeep({
        [subject]: {
          model: action.bookmark,
          isEditing: false,
          isNew: false
        }
      })
    case ActionTypes.BOOKMARKS_EDIT_BOOKMARK_CANCEL:
      return state.get(subject).isNew
        ? state.remove(subject)
        : state.setIn([subject, 'isEditing'], false)
    case ActionTypes.BOOKMARKS_EDIT_BOOKMARK:
      return state.setIn([subject, 'isEditing'], true)
    case ActionTypes.BOOKMARKS_CREATE_NEW_BOOKMARK:
      return state.set(subject, {
        model: action.bookmark,
        isEditing: false,
        isNew: true
      })
    case ActionTypes.BOOKMARKS_LOAD_AUTHORIZATIONS_SUCCESS:
      return state.setIn([subject, 'authorizations'], action.authorizations)
    case ActionTypes.BOOKMARKS_EDIT_PERMISSIONS:
      return state.setIn([subject, 'isEditingPermissions'], true)
    case ActionTypes.BOOKMARKS_CANCEL_EDIT_PERMISSIONS:
      return state.setIn([subject, 'isEditingPermissions'], false)
    case ActionTypes.BOOKMARKS_SAVE_PERMISSIONS_SUCCESS:
      return state
        .setIn([subject, 'authorizations'], action.authorizations)
        .setIn([subject, 'isEditingPermissions'], false)
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
  profile,
  bookmarks,
  bookmarksUrl,
  filters,
  error
})
