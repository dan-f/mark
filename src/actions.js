import * as Immutable from 'immutable'
import { rdflib, web } from 'solid-client'

import * as ActionTypes from './actionTypes'
import * as utils from './utils'

import { bookmarkModelFactory } from './models'

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
      .then(bookmarksUrl => {
        dispatch(setBookmarksUrl(bookmarksUrl))
        return bookmarksUrl
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

// Add/save bookmarks

export function saveBookmark (bookmark) {
  return dispatch => {
    dispatch(saveBookmarkRequest())
    return bookmark.save(rdflib, web)
      .then(savedBookmark => {
        dispatch(saveBookmarkSuccess(savedBookmark))
        return savedBookmark
      })
      .catch(error => {
        dispatch(saveBookmarkError(error))
        throw error
      })
  }
}

export function saveBookmarkRequest () {
  return {
    type: ActionTypes.BOOKMARKS_SAVE_BOOKMARK_REQUEST
  }
}

export function saveBookmarkSuccess (bookmark) {
  return {
    type: ActionTypes.BOOKMARKS_SAVE_BOOKMARK_SUCCESS,
    bookmark
  }
}

export function saveBookmarkError (error) {
  return {
    type: ActionTypes.BOOKMARKS_SAVE_BOOKMARK_FAILURE,
    error
  }
}

// Bookmark loading

export function loadBookmarks (url, ownerWebId) {
  return dispatch => {
    dispatch(loadBookmarksRequest(url))
    return web.get(url)
      .then(solidResponse => {
        const bookmarksGraph = solidResponse.parsedGraph()
        const bookmarkModel = bookmarkModelFactory(ownerWebId)
        const bookmarks = Immutable.Set(bookmarksGraph.statements.map(st => st.subject.value))
          .map(subject => bookmarkModel(bookmarksGraph, subject))
          .toArray()
        dispatch(loadBookmarksSuccess(bookmarks))
        return bookmarksGraph
      })
      .catch(error => {
        dispatch(loadBookmarksFailure(error))
        throw error
      })
  }
}

export function loadBookmarksRequest (url) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_REQUEST,
    url
  }
}

export function loadBookmarksSuccess (bookmarks) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_SUCCESS,
    bookmarks
  }
}

export function loadBookmarksFailure (error) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_FAILURE,
    error
  }
}

// Setting the bookmarks URL for the application

export function setBookmarksUrl (url) {
  return {
    type: ActionTypes.BOOKMARKS_SET_BOOKMARKS_URL,
    url
  }
}

// General error

export function bookmarksError (error) {
  return {
    type: ActionTypes.BOOKMARKS_ERROR,
    error
  }
}
