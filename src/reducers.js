import { combineReducers } from 'redux'
import auth from 'redux-solid-auth/lib/reducers'

import * as ActionTypes from './actionTypes'

function bookmarks (state = [], action) {
  switch (action.type) {
    case ActionTypes.BOOKMARKS_LOAD_SUCCESS:
      // TODO: return models
      return state
    default:
      return state
  }
}

export default combineReducers({
  auth,
  bookmarks
})
