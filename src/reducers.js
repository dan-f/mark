import * as Immutable from 'immutable'
import { combineReducers } from 'redux'

import * as ActionTypes from './actionTypes'

const initialAuthState = { webId: null, key: null, lastIdp: '' }
export function auth (state = initialAuthState, action) {
  switch (action.type) {
    case ActionTypes.MARK_SAVE_AUTH_CREDENTIALS:
      return { ...state, webId: action.webId, key: action.key }
    case ActionTypes.MARK_CLEAR_AUTH_CREDENTIALS:
      return { ...state, webId: null, key: null }
    case ActionTypes.MARK_SAVE_LAST_IDP:
      return { ...state, lastIdp: action.lastIdp }
    default:
      return state
  }
}

const initialProfileState = { 'foaf:img': '/solid-logo.svg' }
export const profile = (state = initialProfileState, action) => {
  switch (action.type) {
    case ActionTypes.MARK_LOAD_PROFILE_SUCCESS:
      return action.profile
    case ActionTypes.MARK_CLEAR_PROFILE:
      return initialProfileState
    default:
      return state
  }
}

const initialEndpointsState = {
  login: null,
  logout: null,
  proxy: null,
  twinql: 'https://databox.me/,query'
}
export function endpoints (state = initialEndpointsState, action) {
  switch (action.type) {
    case ActionTypes.MARK_SAVE_ENDPOINTS:
      return action.endpoints
    case ActionTypes.MARK_CLEAR_ENDPOINTS:
      return initialEndpointsState
    default:
      return state
  }
}

export function bookmarks (state = Immutable.Map(), action) {
  const id = action.bookmark && action.bookmark.has('@id')
    ? action.bookmark.get('@id')
    : action.bookmark && action.bookmark.has('data')
      ? action.bookmark.getIn(['data', '@id'])
      : null
  switch (action.type) {
    case ActionTypes.MARK_LOAD_SUCCESS:
      return action.bookmarks.map(bookmark =>
        Immutable.Map({
          isEditing: false,
          isNew: false,
          data: bookmark
        })
      )
    case ActionTypes.MARK_SAVE_BOOKMARK_SUCCESS:
      return state.set(id, Immutable.Map({
        data: action.bookmark,
        isEditing: false,
        isNew: false
      }))
    case ActionTypes.MARK_EDIT_BOOKMARK_CANCEL:
      return state.getIn([id, 'isNew'])
        ? state.remove(id)
        : state.setIn([id, 'isEditing'], false)
    case ActionTypes.MARK_EDIT_BOOKMARK:
      return state.setIn([id, 'isEditing'], true)
    case ActionTypes.MARK_CREATE_NEW_BOOKMARK:
      return state.set(id, Immutable.Map({
        data: action.bookmark,
        isEditing: false,
        isNew: true
      }))
    default:
      return state
  }
}

export function selectedTags (state = Immutable.Set(), action) {
  switch (action.type) {
    case ActionTypes.MARK_FILTER_ADD_TAG:
      return state.add(action.tag)
    case ActionTypes.MARK_FILTER_REMOVE_TAG:
      return state.remove(action.tag)
    default:
      return state
  }
}

export function showArchived (state = false, action) {
  switch (action.type) {
    case ActionTypes.MARK_FILTER_TOGGLE_ARCHIVED:
      return action.shown
    default:
      return state
  }
}

const filters = combineReducers({selectedTags, showArchived})

export function alerts (state = Immutable.Map(), action) {
  const { type, kind, heading, message } = action
  switch (type) {
    case ActionTypes.MARK_ALERT_SET:
      return state.set(kind, {
        heading,
        message
      })
    case ActionTypes.MARK_ALERT_CLEAR:
      return state.delete(action.kind)
    default:
      return state
  }
}

export default combineReducers({
  auth,
  profile,
  endpoints,
  bookmarks,
  filters,
  alerts
})
