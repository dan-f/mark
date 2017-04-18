import * as Immutable from 'immutable'
import { getProfile, rdflib, web, vocab } from 'solid-client'
import urljoin from 'url-join'
import uuid from 'uuid'

import { Actions as AuthActions } from 'redux-solid-auth'

import * as ActionTypes from './actionTypes'
import * as utils from './utils'

import { bookmarkModelFactory } from './models'

// Authentication

export const { authenticate, checkAuthenticated } = AuthActions

export function checkProfile (config) {
  return dispatch => {
    return dispatch(checkAuthenticated(config))
      .catch(error => {
        dispatch(setError("Couldn't authenticate"))
        throw error
      })
      .then(webId => {
        return webId
          ? dispatch(loadProfile(webId))
          : null
      })
  }
}

export function login (config) {
  return dispatch => {
    return dispatch(authenticate(config))
      .catch(error => {
        dispatch(setError('Could not log in'))
        throw error
      })
      .then(webId => {
        return webId
          ? dispatch(loadProfile(webId))
          : null
      })
  }
}

export function loadProfile (webId) {
  return dispatch => {
    dispatch(loadProfileRequest())
    return getProfile(webId)
      .then(profile => {
        dispatch(loadProfileSuccess(profile))
        return profile
      })
      .catch(error => {
        dispatch(setError("Couldn't load your profile"))
        throw error
      })
  }
}

export function loadProfileRequest () {
  return { type: ActionTypes.BOOKMARKS_LOAD_PROFILE_REQUEST }
}

export function loadProfileSuccess (profile) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_PROFILE_SUCCESS,
    profile
  }
}

// Bookmark application install

export function maybeInstallAppResources () {
  return (dispatch, getState) => {
    return dispatch(registerBookmarks())
      .then(bookmarksUrl => {
        return web.head(bookmarksUrl)
          .catch(error => {
            if (error.code === 404) {
              return dispatch(createBookmarksResource(bookmarksUrl))
            }
            dispatch(setError('Could not find the bookmarks file'))
            throw error
          })
          .then(() => bookmarksUrl)
      })
      .then(bookmarksUrl => {
        dispatch(setBookmarksUrl(bookmarksUrl))
        return bookmarksUrl
      })
  }
}

export function registerBookmarks () {
  return (dispatch, getState) => {
    const { profile } = getState()
    return utils.loadBookmarksUrl(profile)
      .then(bookmarksUrl => {
        if (bookmarksUrl) {
          return bookmarksUrl
        }
        dispatch(registerBookmarksRequest())
        return utils.registerBookmarkType(profile)
          .then(updatedProfile => {
            const updatedBookmarksUrl = utils.getBookmarksUrl(updatedProfile)
            dispatch(registerBookmarksSuccess(updatedBookmarksUrl))
            return updatedBookmarksUrl
          })
          .catch(error => {
            error._message = 'Could not register bookmarks in the type index'
            throw error
          })
      })
      .catch(error => {
        dispatch(setError(error._message || 'Could not load the type index'))
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

// Create bookmarks resource

export function createBookmarksResource (url) {
  return dispatch => {
    dispatch(createBookmarksResourceRequest())
    return web.post(url, '')
      .then(resp => dispatch(createBookmarksResourceSuccess()))
      .catch(error => {
        dispatch(setError('Could not create bookmarks file'))
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
        dispatch(setError('Could not save your bookmark'))
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

// Bookmark loading

export function loadBookmarks (containerUrl) {
  return dispatch => {
    dispatch(loadBookmarksRequest(containerUrl))
    // This trick relies on a solid server's undocumented ability to combine all
    // the named graphs within a container into a single graph in a single
    // network request.
    return web.get(urljoin(containerUrl, '*'))
      .then(solidResponse => {
        const bookmarksGraph = solidResponse.parsedGraph()
        const bookmarkType = rdflib.NamedNode.fromValue('http://www.w3.org/2002/01/bookmark#Bookmark')
        const bookmarks = bookmarksGraph.match(null, vocab.rdf('type'), bookmarkType)
          .map(st => {
            // Need to construct graphs to reflect the actual named graphs they
            // were scooped out of.
            const bookmarkGraph = rdflib.graph()
            const namedGraph = rdflib.NamedNode.fromValue(st.subject.value.split('#')[0])
            bookmarksGraph.statementsMatching(st.subject)
              .forEach(s => {
                bookmarkGraph.add(s.subject, s.predicate, s.object, namedGraph)
              })
            return bookmarkModelFactory(bookmarkGraph, namedGraph, st.subject.value)
          })
          .reduce((map, model) => {
            return map.set(model.subject.value, {model, isEditing: false})
          }, Immutable.Map())
        dispatch(loadBookmarksSuccess(bookmarks))
        return bookmarksGraph
      })
      .catch(error => {
        dispatch(setError('Could not load your bookmarks'))
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

// Setting the bookmarks URL for the application

export function setBookmarksUrl (url) {
  return {
    type: ActionTypes.BOOKMARKS_SET_BOOKMARKS_URL,
    url
  }
}

// General error

export function setError (errorMessage) {
  return {
    type: ActionTypes.BOOKMARKS_ERROR_SET,
    errorMessage
  }
}

export function clearError () {
  return {
    type: ActionTypes.BOOKMARKS_ERROR_CLEAR
  }
}

// Editing

export function edit (bookmark) {
  return {
    type: ActionTypes.BOOKMARKS_EDIT_BOOKMARK,
    bookmark
  }
}

export function cancelEdit (bookmark) {
  return {
    type: ActionTypes.BOOKMARKS_EDIT_BOOKMARK_CANCEL,
    bookmark
  }
}

export function createNew () {
  return (dispatch, getState) => {
    const { bookmarksUrl } = getState()
    const bookmarkUrl = urljoin(bookmarksUrl, uuid.v4())
    return dispatch(newBookmark(bookmarkUrl))
  }
}

export function createAndEditNew () {
  return dispatch => {
    const { bookmark } = dispatch(createNew())
    return dispatch(edit(bookmark))
  }
}

function newBookmark (bookmarkUrl) {
  return {
    type: ActionTypes.BOOKMARKS_CREATE_NEW_BOOKMARK,
    bookmark: bookmarkModelFactory(
      rdflib.graph(), bookmarkUrl, `${bookmarkUrl}#bookmark`
    )
  }
}

// Filtering

export function addFilterTag (tag) {
  return {
    type: ActionTypes.BOOKMARKS_FILTER_ADD_TAG,
    tag
  }
}

export function removeFilterTag (tag) {
  return {
    type: ActionTypes.BOOKMARKS_FILTER_REMOVE_TAG,
    tag
  }
}

export function showArchived (shown) {
  return {
    type: ActionTypes.BOOKMARKS_FILTER_TOGGLE_ARCHIVED,
    shown
  }
}
