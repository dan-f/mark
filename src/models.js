import { modelFactory } from 'modelld'
import { rdflib } from 'solid-client'

import * as utils from './utils'

const vocab = {
  bookmark: term => rdflib.namedNode(`http://www.w3.org/2002/01/bookmark#${term}`),
  dc: term => rdflib.namedNode(`http://purl.org/dc/elements/1.1/${term}`),
  solid: term => rdflib.namedNode(`http://www.w3.org/ns/solid/terms#${term}`)
}

function getSourceConfig (webId) {
  const bookmarksUrl = utils.defaultBookmarksUrlForWebId(webId)
  return {
    defaultSources: {
      listed: bookmarksUrl
    },
    sourceIndex: {
      [bookmarksUrl]: true
    }
  }
}

export function bookmarkModelFactory (webId) {
  if (webId === '') {
    debugger
  }
  // TODO: bookmarking
  return modelFactory(rdflib, getSourceConfig(webId), {
    url: vocab.bookmark('recalls'),
    title: vocab.dc('title'),
    description: vocab.dc('description'),
    tags: vocab.bookmark('hasTopic'),
    archived: vocab.solid('read')
  })
}
