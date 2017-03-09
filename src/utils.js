import { rdflib, web } from 'solid-client'
import urljoin from 'url-join'

export const BOOKMARK_RDF_CLASS =
  rdflib.namedNode('http://www.w3.org/2002/01/bookmark#Bookmark')

/**
 * Returns the URL of the container for application data
 * @param {String} baseUrl the url of profile storage
 */
export function appDataContainer (storageUrl) {
  return urljoin(storageUrl, 'application-data')
}

/**
 * Returns the url to the container for mark app data
 * @param {String} storageUrl the url of profile storage
 */
export function markDataContainer (storageUrl) {
  return urljoin(appDataContainer(storageUrl), 'mark')
}

/**
 * Given the base url of a user's solid server, describes where bookmarks are
 * expected to reside.
 */
export function defaultBookmarksUrl (storageUrl) {
  return urljoin(markDataContainer(storageUrl), 'bookmarks')
}

/**
 * Given a user's webId, get the URL to the resource where bookmarks are
 * expected to reside.
 */
export function defaultBookmarksUrlForProfile (solidProfile) {
  const storageLocations = solidProfile.storage
  if (!storageLocations.length) {
    throw new Error('Profile missing a storage location')
  }
  // TODO: prompt the user for which location they want to use - https://github.com/dan-f/mark/issues/16
  return defaultBookmarksUrl(storageLocations[0])
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
    defaultBookmarksUrlForProfile(solidProfile),
    'container',
    true
  )
}

/**
 * Figure out where the user's bookmarks are stored.
 */
export function loadBookmarksUrl (solidProfile) {
  return solidProfile.loadTypeRegistry(web)
    .then(updatedProfile => {
      return getBookmarksUrl(updatedProfile)
    })
}

export function getBookmarksUrl (solidProfile) {
  const bookmarksUrls = solidProfile.typeRegistryForClass(BOOKMARK_RDF_CLASS)
    .filter(registration => registration.locationType === 'container')
    .map(registration => registration.locationUri)
  return bookmarksUrls.length ? bookmarksUrls[0] : null
}
