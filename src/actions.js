/* global fetch */
import * as Immutable from 'immutable'
import urljoin from 'url-join'
import uuid from 'uuid'
import 'isomorphic-fetch'

import * as ActionTypes from './actionTypes'
import * as utils from './utils'

const PREFIX_CONTEXT = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  book: 'http://www.w3.org/2002/01/bookmark#',
  dc: 'http://purl.org/dc/elements/1.1/',
  foaf: 'http://xmlns.com/foaf/0.1/',
  ldp: 'http://www.w3.org/ns/ldp#',
  pim: 'http://www.w3.org/ns/pim/space#',
  solid: 'http://solid.github.io/vocab/solid-terms.ttl#'
}

// Authentication

export const saveCredentials = ({ webId, key }) => ({
  type: ActionTypes.BOOKMARKS_SAVE_AUTH_CREDENTIALS,
  webId,
  key
})

export const clearCredentials = () => ({
  type: ActionTypes.BOOKMARKS_CLEAR_AUTH_CREDENTIALS
})

export const saveLastIdp = lastIdp => ({
  type: ActionTypes.BOOKMARKS_SAVE_LAST_IDP,
  lastIdp
})

export const logout = () => dispatch => {
  dispatch(clearCredentials())
  dispatch(clearProfile())
}

// Profile

export const loadProfile = () => (dispatch, getState) => {
  const { auth: { webId } } = getState()
  dispatch(loadProfileRequest())
  return dispatch(twinql(`
    @prefix foaf ${PREFIX_CONTEXT.foaf}
    ${webId} {
      foaf:img
    }
  `)).then(response => {
    if (response['@error']) {
      throw new Error(response['@error'].message)
    }
    return response
  }).then(response =>
    dispatch(loadProfileSuccess({
      'foaf:img': response['foaf:img'] ? response['foaf:img']['@id'] : '/solid-logo.svg'
    }))
  ).catch(error => {
    dispatch(setError({ heading: `Couldn't load your profile`, message: error.message }))
    throw error
  })
}

export const clearProfile = () => ({
  type: ActionTypes.BOOKMARKS_CLEAR_PROFILE
})

export const loadProfileRequest = () => ({
  type: ActionTypes.BOOKMARKS_LOAD_PROFILE_REQUEST
})

export const loadProfileSuccess = profile => ({
  type: ActionTypes.BOOKMARKS_LOAD_PROFILE_SUCCESS,
  profile
})

// Twinql

export function twinql (query) {
  return (dispatch, getState) => {
    const { endpoints: { twinql }, auth: { key } } = getState()
    return fetch(twinql, {
      method: 'POST',
      headers: { 'content-type': 'text/plain', 'Authorization': `Bearer ${key}` },
      body: query
    }).then(response => response.json())
  }
}

// Endpoints

export function findEndpoints (url) {
  return dispatch => {
    const solidTerms = term =>
      `http://solid.github.io/vocab/solid-terms.ttl#${term}`
    return fetch(url, { method: 'OPTIONS' })
      .then(utils.checkStatus)
      .then(response => {
        const linkHeaders = utils.parseLinkHeader(response.headers.get('link'))
        const getTerm = term => linkHeaders[solidTerms(term + 'Endpoint')][0]
        return dispatch(saveEndpoints({
          login: getTerm('login'),
          logout: getTerm('logout'),
          proxy: getTerm('proxy'),
          twinql: getTerm('twinql')
        }))
      })
      .catch(error => {
        const { message } = error
        dispatch(setError({ heading: `Couldn't find data needed to log in`, message }))
        throw error
      })
  }
}

export function saveEndpoints (endpoints) {
  return {
    type: ActionTypes.BOOKMARKS_SAVE_ENDPOINTS,
    endpoints
  }
}

export function clearEndpoints (endpoints) {
  return {
    type: ActionTypes.BOOKMARKS_CLEAR_ENDPOINTS
  }
}

// Bookmark list discovery

export const findLists = () => (dispatch, getState) => {
  const { auth: { webId } } = getState()
  const socialTraversal = `
    foaf:name
    foaf:img
  `
  const listTraversal = `
    solid:publicTypeIndex => ( rdf:type solid:TypeRegistration solid:forClass book:Bookmark ) {
      solid:instanceContainer
    }
  `
  dispatch(findListsRequest())
  return dispatch(twinql(`
    @prefix rdf   ${PREFIX_CONTEXT.rdf}
    @prefix book  ${PREFIX_CONTEXT.book}
    @prefix foaf ${PREFIX_CONTEXT.foaf}
    @prefix solid ${PREFIX_CONTEXT.solid}
    ${webId} {
      ${socialTraversal}
      ${listTraversal}
      [ foaf:knows ] {
        ${socialTraversal}
        ${listTraversal}
      }
    }
  `)).then(response => {
    if (response['@error']) {
      const error = new Error(response['@error'].message)
      throw error
    }
    return response
  }).then(response => {
    const getList = resp => ({
      webId: resp['@id'],
      name: resp['foaf:name'] ? resp['foaf:name']['@value'] : resp['@id'],
      img: resp['foaf:img'] ? resp['foaf:img']['@id'] : '/solid-logo.svg',
      listUrl: resp['solid:publicTypeIndex']['@graph'][0]['solid:instanceContainer']['@id']
    })
    const justMarkUsers = person => (
      person['solid:publicTypeIndex'] &&
      !person['solid:publicTypeIndex']['@error'] &&
      person['solid:publicTypeIndex']['@graph'].length &&
      person['solid:publicTypeIndex']['@graph'][0]['solid:instanceContainer']
    )
    return [ getList(response), ...response['foaf:knows'].filter(justMarkUsers).map(getList) ]
  }).then(lists =>
    dispatch(findListsSuccess(lists))
  ).catch(error => {
    const { message } = error
    dispatch(setError({ heading: `Couldn't find your/your friends' bookmarks lists`, message }))
    throw error
  })
}

export const findListsRequest = () => ({
  type: ActionTypes.BOOKMARKS_FIND_LISTS_REQUEST
})

export const findListsSuccess = lists => ({
  type: ActionTypes.BOOKMARKS_FIND_LISTS_SUCCESS,
  lists
})

// Bookmark application install

export function maybeInstallAppResources () {
  return (dispatch, getState) =>
    dispatch(getBookmarksContainer())
      .then(bookmarksContainer =>
        bookmarksContainer || dispatch(createBookmarksContainer())
          .then(bookmarksContainer => dispatch(registerBookmarksContainer(bookmarksContainer)))
      )
}

export function getBookmarksContainer () {
  return (dispatch, getState) => {
    const { auth: { webId } } = getState()
    return dispatch(twinql(`
      @prefix rdf   ${PREFIX_CONTEXT.rdf}
      @prefix solid ${PREFIX_CONTEXT.solid}
      @prefix book  ${PREFIX_CONTEXT.book}
      ${webId} {
        solid:publicTypeIndex => ( rdf:type solid:TypeRegistration solid:forClass book:Bookmark ) {
          solid:instanceContainer
        }
      }
    `)).then(response => {
      const error = response['@error'] || response['solid:publicTypeIndex']['@error']
      if (error) {
        throw new Error(error.message)
      }
      const matchingRegistrations = response['solid:publicTypeIndex']['@graph']
      return matchingRegistrations.length
        ? matchingRegistrations[0]['solid:instanceContainer']['@id']
        : null
    }).catch(error => {
      const { message } = error
      dispatch(setError({ heading: `Couldn't find your Mark installation`, message }))
      throw error
    })
  }
}

export function createBookmarksContainer () {
  return (dispatch, getState) => {
    const { auth: { webId, key }, endpoints: { proxy } } = getState()
    dispatch(createBookmarksContainerRequest())
    return dispatch(twinql(`
      @prefix pim ${PREFIX_CONTEXT.pim}
      ${webId} { pim:storage }
    `)).then(response => {
      const error = response['@error']
      const storage = response['pim:storage']
      if (error) {
        throw new Error(error.message)
      }
      if (!storage) {
        throw new Error('User has no pim:storage')
      }
      return storage
    }).then(storage => {
      const bookmarksContainer = utils.defaultBookmarksUrl(storage['@id'])
      const proxiedContainerUrl = utils.proxyUrl(proxy, urljoin(bookmarksContainer, '.config'), key)
      return fetch(proxiedContainerUrl, { method: 'HEAD' })
        .then(response =>
          response.status >= 200 && response.status < 300
            ? response
            : fetch(proxiedContainerUrl, { method: 'PUT' }).then(utils.checkStatus)
        )
        .then(() => bookmarksContainer)
    }).then(bookmarksContainer => {
      dispatch(createBookmarksContainerSuccess(bookmarksContainer))
      return bookmarksContainer
    })
    .catch(error => {
      const { message } = error
      dispatch(setError({ heading: `Couldn't install your bookmarks container`, message }))
      throw error
    })
  }
}

export function createBookmarksContainerRequest () {
  return {
    type: ActionTypes.BOOKMARKS_CREATE_CONTAINER_REQUEST
  }
}

export function createBookmarksContainerSuccess (bookmarksContainerUrl) {
  return {
    type: ActionTypes.BOOKMARKS_CREATE_CONTAINER_SUCCESS,
    bookmarksContainerUrl
  }
}

export function registerBookmarksContainer (bookmarksContainer) {
  return (dispatch, getState) => {
    const { auth: { webId, key }, endpoints: { proxy } } = getState()
    return dispatch(twinql(`
      @prefix solid ${PREFIX_CONTEXT.solid}
      ${webId} { solid:publicTypeIndex }
    `)).then(response => {
      const publicTypeIndex = response['solid:publicTypeIndex']['@id']
      const book = PREFIX_CONTEXT.book
      const solid = PREFIX_CONTEXT.solid
      const registrationId = uuid.v4()
      const registrationTriples = [
        `<#${registrationId}> a <${solid}TypeRegistration> .`,
        `<#${registrationId}> <${solid}forClass> <${book}Bookmark> .`,
        `<#${registrationId}> <${solid}instanceContainer> <${bookmarksContainer}> .`
      ]
      dispatch(registerBookmarksRequest())
      return utils.sparqlPatch(utils.proxyUrl(proxy, publicTypeIndex, key), [], registrationTriples)
    }).then(() => {
      dispatch(registerBookmarksSuccess(bookmarksContainer))
      return bookmarksContainer
    })
    .catch(error => {
      const { message } = error
      dispatch(setError({ heading: `Couldn't update your bookmarks type registration`, message }))
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

// Add/save bookmarks

export function saveBookmark (original, updated, isNew) {
  return (dispatch, getState) => {
    const { auth: { key }, endpoints: { proxy } } = getState()
    const grpahOf = node => node.split('#')[0]
    const [ url, toDel, toIns ] = isNew
      ? [ grpahOf(updated.get('@id')), [], utils.jsonLdToNT(updated, PREFIX_CONTEXT) ]
      : [ grpahOf(original.get('@id')), ...utils.diff(original, updated, PREFIX_CONTEXT) ]
    dispatch(saveBookmarkRequest())
    return utils.sparqlPatch(utils.proxyUrl(proxy, url, key), isNew ? [] : toDel, toIns)
      .then(() => dispatch(saveBookmarkSuccess(updated)))
      .catch(error => {
        const { message } = error
        dispatch(setError({ heading: `Couldn't save your bookmark`, message }))
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
  return (dispatch, getState) => {
    dispatch(loadBookmarksRequest(containerUrl))
    return dispatch(twinql(`
      @prefix rdf   ${PREFIX_CONTEXT.rdf}
      @prefix book  ${PREFIX_CONTEXT.book}
      @prefix dc    ${PREFIX_CONTEXT.dc}
      @prefix ldp   ${PREFIX_CONTEXT.ldp}
      @prefix solid ${PREFIX_CONTEXT.solid}
      ${containerUrl} {
        [ ldp:contains ] => ( rdf:type book:Bookmark ) {
          dc:title
          dc:description
          book:recalls
          solid:read
          [ book:hasTopic ]
        }
      }
    `)).then(response => {
      if (response['@error']) {
        throw new Error(response['@error']['message'])
      }
      return response
    }).then(response => {
      const bookmarks = response['ldp:contains']
        .filter(bookmarkResource => bookmarkResource['@graph'].length)
        .map(bookmarkResource => bookmarkResource['@graph'][0])
        .reduce((bookmarks, bookmark) => bookmarks.set(bookmark['@id'], Immutable.fromJS(bookmark)), Immutable.Map())
      dispatch(loadBookmarksSuccess(bookmarks))
      return bookmarks
    }).catch(error => {
      const { message } = error
      dispatch(setError({ heading: `Couldn't load your bookmarks`, message }))
      throw error
    })
  }
}

export function loadBookmarksRequest (url) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_LIST_REQUEST,
    url
  }
}

export function loadBookmarksSuccess (bookmarks) {
  return {
    type: ActionTypes.BOOKMARKS_LOAD_LIST_SUCCESS,
    bookmarks
  }
}

// General error

const _setAlert = kind => message => {
  const action = {
    type: ActionTypes.BOOKMARKS_ALERT_SET,
    kind
  }
  return typeof message === 'object'
    ? { ...action, ...message }
    : { ...action, heading: message }
}

const _clearAlert = kind => () => ({
  type: ActionTypes.BOOKMARKS_ALERT_CLEAR,
  kind
})

export const setError = _setAlert('danger')

export const clearError = _clearAlert('danger')

export const setInfo = _setAlert('info')

export const clearInfo = _clearAlert('info')

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

export function createNew (bookmarksContainer) {
  return (dispatch, getState) => {
    const bookmarkUrl = urljoin(bookmarksContainer, uuid.v4())
    return dispatch(newBookmark(bookmarkUrl))
  }
}

export function createAndEditNew (bookmarksContainer) {
  return dispatch => {
    const { bookmark } = dispatch(createNew(bookmarksContainer))
    return dispatch(edit(bookmark))
  }
}

function newBookmark (bookmarkUrl) {
  return {
    type: ActionTypes.BOOKMARKS_CREATE_NEW_BOOKMARK,
    bookmark: Immutable.fromJS({
      '@id': `${bookmarkUrl}#bookmark`,
      'rdf:type': { '@id': 'book:Bookmark' },
      'dc:title': { '@value': '' },
      'dc:description': { '@value': '' },
      'book:recalls': { '@id': '' },
      'book:hasTopic': [],
      'solid:read': {
        '@value': 'false',
        '@type': 'http://www.w3.org/2001/XMLSchema#boolean'
      }
    })
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
