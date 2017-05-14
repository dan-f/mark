/* global fetch */
import Immutable from 'immutable'
import urljoin from 'url-join'
import 'isomorphic-fetch'

export const jsonLdToNT = (json, context) =>
  json.reduce((statements, object, predicate) =>
    predicate.startsWith('@')
      ? statements
      : statements.union(statementsForPredicate(json, predicate, context))
  , Immutable.Set()).toJS()

const statementsForPredicate = (graph, predicate, context) => {
  const id = graph.get('@id')
  const object = graph.get(predicate)
  const expandedPredicate = expandPrefixedValue(predicate, context)
  return Array.isArray(object) || Immutable.List.isList(object)
    ? Immutable.Set(object.map(o => `<${id}> <${expandedPredicate}> ${jsonLdValueToNT(o, context)} .`))
    : Immutable.Set.of(`<${id}> <${expandedPredicate}> ${jsonLdValueToNT(object, context)} .`)
}

const expandPrefixedValue = (value, context) => {
  if (value.startsWith('http')) {
    return value
  }
  const [ prefix, path ] = value.split(':')
  return context[prefix] + path
}

const jsonLdValueToNT = (value, context) => {
  switch (typeof value) {
    case 'string':
      return `"${value}"`
    case 'object':
      if (value.has('@id')) {
        return `<${expandPrefixedValue(value.get('@id'), context)}>`
      }
      if (value.has('@value')) {
        const raw = value.get('@value')
        const type = value.get('@type')
        const lang = value.get('@language')
        if (type) {
          return `"${raw}"^^<${type}>`
        }
        if (lang) {
          return `"${raw}"@${lang}`
        }
        return `"${raw}"`
      }
    default: // eslint-disable-line
      throw new Error(`Unrecognized JSON-LD value: ${value}`)
  }
}

// Assumes the original and updated bookmarks exist on the same named graph and have the same subject
export const diff = (original, updated, context) => {
  if (original.get('@id') !== updated.get('@id')) {
    throw new Error('Cannot diff bookmarks with different subjects')
  }
  return original
    .reduce((deleteInsertList, originalObject, predicate) => {
      const updatedObject = updated.get(predicate)
      if (originalObject === updatedObject) {
        return deleteInsertList
      }
      const originalStatements = statementsForPredicate(original, predicate, context)
      const updatedStatements = statementsForPredicate(updated, predicate, context)
      return deleteInsertList
        .update(0, toDel => toDel.union(originalStatements.subtract(updatedStatements)))
        .update(1, inserted => inserted.union(updatedStatements.subtract(originalStatements)))
    }, Immutable.List.of(Immutable.Set(), Immutable.Set()))
    .toJS()
}

export const sparqlPatch = (url, toDel, toIns, headers = {}) =>
  fetch(url, {
    method: 'PATCH',
    headers: { ...{ 'content-type': 'application/sparql-update' }, ...headers },
    body: sparqlPatchQuery(toDel, toIns)
  }).then(checkStatus)

export const sparqlPatchQuery = (toDel, toIns) => {
  if (!toDel.length && !toIns.length) {
    throw new Error('Cannot compose patch query for a no-op patch')
  }
  const toDelQuery = toDel.length
    ? `DELETE DATA { ${toDel.join(' ')} };\n`
    : ''
  const toInsQuery = toIns.length
    ? `INSERT DATA { ${toIns.join(' ')} };\n`
    : ''
  return toDelQuery + toInsQuery
}

export const proxyUrl = (proxy, resource, key) =>
  `${proxy}${encodeURIComponent(resource)}&key=${key}`

export const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * Parses a Link header from an XHR HTTP Request.
 * @method parseLinkHeader
 *
 * Borrowed from solid-web-client
 * Copyright (c) 2015 Solid
 * Released under The MIT License
 * (https://github.com/solid/solid-web-client/blob/master/src/util/web-util.js)
 *
 * @param link {string} Contents of the Link response header
 *
 * @return {Object}
 */
export function parseLinkHeader (link) {
  /* eslint-disable */
  if (!link) {
    return {}
  }

  let linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g
  let paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g
  let matches = link.match(linkexp)
  let rels = {}

  for (let i = 0; i < matches.length; i++) {
    let split = matches[i].split('>')
    let href = split[0].substring(1)
    let ps = split[1]
    let s = ps.match(paramexp)

    for (let j = 0; j < s.length; j++) {
      let p = s[j]
      let paramsplit = p.split('=')
      // var name = paramsplit[0]
      let rel = paramsplit[1].replace(/["']/g, '')

      if (!rels[rel]) {
        rels[rel] = []
      }

      rels[rel].push(href)

      if (rels[rel].length > 1) {
        rels[rel].sort()
      }
    }
  }
  /* eslint-enable */

  return rels
}

/**
 * Returns the URL of the container for application data
 * @param {String} baseUrl the url of profile storage
 */
export function appDataContainer (storageUrl) {
  return urljoin(storageUrl, 'Applications')
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
export function defaultBookmarkListContainerUrl (storageUrl) {
  return urljoin(markDataContainer(storageUrl), 'bookmarks', '/')
}
