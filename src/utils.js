import { join } from 'path'
import { rdflib } from 'solid-client'

export const BOOKMARK_RDF_CLASS =
  rdflib.namedNode('http://www.w3.org/2002/01/bookmark#Bookmark')

/**
 * Gets the base url (up to and including the domain) from a url string.
 */
export function getBaseUrl (url) {
  const a = document.createElement('a')
  a.href = url
  return a.origin
}

/**
 * Given the base url of a user's solid server, describes where bookmarks are
 * expected to reside.
 */
export function defaultBookmarksUrl (baseUrl) {
  return join(baseUrl, 'solid-bookmarks', 'bookmarks.ttl')
}

/**
 * Given a user's webId, get the URL to the resource where bookmarks are
 * expected to reside.
 */
export function defaultBookmarksUrlForWebId (webId) {
  return defaultBookmarksUrl(getBaseUrl(webId))
}

/**
 * Register this app with the user's solid app registry.
 */
export function registerApp (solidProfile) {}

/**
 * Register where the user's bookmarks are stored.
 */
export function registerBookmarkType (solidProfile) {
  return solidProfile.registerType(
    BOOKMARK_RDF_CLASS,
    defaultBookmarksUrlForWebId(solidProfile.webId),
    'instance',
    true
  )
}

/**
 * Figure out where the user's bookmarks are stored.
 */
export function getBookmarksUrl (solidProfile) {
  const bookmarksUrls = solidProfile.typeRegistryForClass(BOOKMARK_RDF_CLASS)
    .map(registration => registration.locationUri)
  return bookmarksUrls.length ? bookmarksUrls[0] : null
}
