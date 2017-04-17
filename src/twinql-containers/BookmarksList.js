import { connect } from '../lib/react-twinql'

import FilteredBookmarksList from '../containers/FilteredBookmarksList'

export default connect({
  query: ({ bookmarksContainer }) => `
    @prefix rdf  http://www.w3.org/1999/02/22-rdf-syntax-ns#
    @prefix book http://www.w3.org/2002/01/bookmark#
    @prefix dc   http://purl.org/dc/elements/1.1/
    @prefix ldp  http://www.w3.org/ns/ldp#
    @prefix mark http://raw.githubusercontent.com/dan-f/mark/bookmark-lists/public/vocab/mark.ttl#
    ${bookmarksContainer} {
      [ ldp:contains ] ( rdf:type mark:BookmarkResource ) {
        mark:hasBookmark {
          dc:title
          dc:description
          book:recalls
          [ book:hasTopic ]
        }
      }
    }
  `,

  mapResponseToProps: response => {
    if (!response) {
      return { bookmarks: [] }
    }
    const bookmarks = response['ldp:contains']
      .map(resource => resource['mark:hasBookmark'])
    return { bookmarks }
  }
})(FilteredBookmarksList)
