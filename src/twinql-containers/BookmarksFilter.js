import Immutable from 'immutable'

import { connect } from '../lib/react-twinql'

import BookmarksFilter from '../containers/BookmarksFilter'

export default connect({
  query: ({ bookmarksContainer }) => `
    @prefix rdf  http://www.w3.org/1999/02/22-rdf-syntax-ns#
    @prefix ldp  http://www.w3.org/ns/ldp#
    @prefix book http://www.w3.org/2002/01/bookmark#
    @prefix mark http://raw.githubusercontent.com/dan-f/mark/bookmark-lists/public/vocab/mark.ttl#
    ${bookmarksContainer} {
      [ ldp:contains ] ( rdf:type mark:BookmarkResource ) {
        mark:hasBookmark {
          [ book:hasTopic ]
        }
      }
    }
  `,

  mapResponseToProps: response => {
    if (!response) {
      return { tags: [] }
    }
    return {
      tags: response['ldp:contains']
        .map(resource => resource['mark:hasBookmark']['book:hasTopic'])
        .reduce((allTags, curTags) => allTags.union(curTags), Immutable.Set())
        .toJS()
    }
  }
})(BookmarksFilter)
