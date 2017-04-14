import React from 'react'
import { connect } from 'react-redux'
import { connect as twinqlConnect } from '../lib/react-twinql'

export const Bookmark = ({ 'dc:title': title, 'dc:description': description, 'book:recalls': url, 'book.hasTopic': tags }) =>
  <div>
    <div>{title}</div>
    <div>{description}</div>
    <div>{url}</div>
    <div>{tags}</div>
  </div>

export const TwinqlBookmark = twinqlConnect({
  query: props => `
    @prefix rdf   http://www.w3.org/1999/02/22-rdf-syntax-ns#
    @prefix book  http://www.w3.org/2002/01/bookmark#
    @prefix dc    http://purl.org/dc/elements/1.1/
    ${props.bookmark} {
      dc:title
      dc:description
      book:recalls
      book:hasTopic
    }
  `
})(Bookmark)

export const BookmarksList = ({ bookmarks }) =>
  <ul className='list-group'>
    {bookmarks.map(bookmark =>
      <TwinqlBookmark bookmark={bookmark} key={bookmark} />
    )}
  </ul>

const TwinqlBookmarksList = twinqlConnect({
  query: ({ bookmarksContainer }) => `
    @prefix rdf   http://www.w3.org/1999/02/22-rdf-syntax-ns#
    @prefix ldp   http://www.w3.org/ns/ldp#
    @prefix mark  http://raw.githubusercontent.com/dan-f/mark/bookmark-lists/public/vocab/mark.ttl#
    ${bookmarksContainer} {
      [ ldp:contains ] ( rdf:type mark:BookmarkResource ) {
        mark:hasBookmark
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
})(BookmarksList)

const mapStateToProps = state => {
  return {
    bookmarksContainer: state.bookmarksUrl
  }
}

export default connect(mapStateToProps)(TwinqlBookmarksList)
