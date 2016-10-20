import { combineReducers } from 'redux'
import auth from 'redux-solid-auth/lib/reducers'

import * as ActionTypes from './actionTypes'

function bookmarks (state = [], action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_LOAD_SUCCESS:
      return action.bookmarks
    case ActionTypes.BOOKMARKS_SAVE_BOOKMARK_SUCCESS:
      return [...state, action.bookmark]
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

export default combineReducers({
  auth,
  bookmarks,
  bookmarksUrl
})
