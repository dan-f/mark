import * as Immutable from 'immutable'
import { combineReducers } from 'redux'
import auth from 'redux-solid-auth/lib/reducers'

import * as ActionTypes from './actionTypes'

function bookmarks (state = Immutable.Map(), action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_LOAD_SUCCESS:
      return action.bookmarks
    case ActionTypes.BOOKMARKS_SAVE_BOOKMARK_SUCCESS:
    case ActionTypes.BOOKMARKS_EDIT_BOOKMARK_CANCEL:
      return state.set(action.bookmark.subject.value, {
        model: action.bookmark,
        isEditing: false
      })
    case ActionTypes.BOOKMARKS_EDIT_BOOKMARK:
      return state.set(action.bookmark.subject.value, {
        model: action.bookmark,
        isEditing: true
      })
    default:
      return state
  }
}

function bookmarksUrl (state = '', action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_SET_BOOKMARKS_URL:
      return action.url
    default:
      return state
  }
}

function tags (state = Immutable.Set(), action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_FILTER_ADD_TAG:
      return state.add(tag)
    case ActionTypes.BOOKMARKS_FILTER_REMOVE_TAG:
      return state.remove(tag)
    default:
      return state
  }
}

const filters = combineReducers({tags})

export default combineReducers({
  auth,
  bookmarks,
  bookmarksUrl
})
