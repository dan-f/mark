import { web } from 'solid-client'

import * as ActionTypes from './actionTypes'
import * as utils from './utils'

// Bookmark application install

export function maybeInstallAppResources (solidProfile) {
  return dispatch => {
    return dispatch(registerBookmarks(solidProfile))
      .then(bookmarksUrl => {
        return web.head(bookmarksUrl)
          .catch(error => {
            if (error.code === 404) {
              return dispatch(createBookmarksResource(bookmarksUrl))
            }
            throw error
          })
          .then(() => bookmarksUrl)
      })
      .catch(error => {
        dispatch(bookmarksError(error))
        throw error
      })
  }
}

export function registerBookmarks (solidProfile) {
  return dispatch => {
    const bookmarksUrl = utils.getBookmarksUrl(solidProfile)
    console.log('bookmarks url: ', bookmarksUrl)
    if (bookmarksUrl) {
      return Promise.resolve(bookmarksUrl)
    }
    dispatch(registerBookmarksRequest())
    return utils.registerBookmarkType(solidProfile)
      .then(updatedProfile => {
        const updatedBookmarksUrl = utils.getBookmarksUrl(updatedProfile)
        dispatch(registerBookmarksSuccess(updatedBookmarksUrl))
        return updatedBookmarksUrl
      })
      .catch(error => {
        dispatch(registerBookmarksFailure(error))
        throw error
      })
  }
}

export function registerBookmarksRequest () {
  return {
    type: ActionTypes.BOOKMARKS_REGISTER_REQUEST
  }
}

export function registerBookmarksSuccess (bookmarksUrl) {
  return {
    type: ActionTypes.BOOKMARKS_REGISTER_SUCCESS,
    bookmarksUrl
  }
}

export function registerBookmarksFailure (error) {
  return {
    type: ActionTypes.BOOKMARKS_REGISTER_FAILURE,
    error
  }
}

// Create bookmarks resource

export function createBookmarksResource (url) {
  return dispatch => {
    dispatch(createBookmarksResourceRequest())
    return web.put(url, '')
      .then(resp => dispatch(createBookmarksResourceSuccess()))
      .catch(error => {
        dispatch(createBookmarksResourceFailure(error))
        throw error
      })
  }
}

export function createBookmarksResourceRequest () {
  return {
    type: ActionTypes.BOOKMARKS_CREATE_RESOURCE_REQUEST
  }
}

export function createBookmarksResourceSuccess () {
  return {
    type: ActionTypes.BOOKMARKS_CREATE_RESOURCE_SUCCESS
  }
}

export function createBookmarksResourceFailure (error) {
  return {
    type: ActionTypes.BOOKMARKS_CREATE_RESOURCE_FAILURE,
    error
  }
}

// Bookmark loading

export function loadBookmarks (url) {
  return dispatch => {
    dispatch(loadBookmarksRequest(url))
    return web.get(url)
      .then(solidResponse => dispatch(loadBookmarksSuccess(solidResponse.parsedGraph())))
      .catch(error => dispatch(loadBookmarksFailure(error)))
  }
}

export function loadBookmarksRequest (url) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_REQUEST,
    url
  }
}

export function loadBookmarksSuccess (graph) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_SUCCESS,
    graph
  }
}

export function loadBookmarksFailure (error) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_FAILURE,
    error
  }
}

// General error

export function bookmarksError (error) {
  return {
    type: ActionTypes.BOOKMARKS_ERROR,
    error
  }
}
