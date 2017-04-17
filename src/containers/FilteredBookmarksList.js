import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'

import BookmarksList from '../components/BookmarksList'

const FilteredBookmarksList = ({ bookmarks, selectedTags }) => {
  const filteredBookmarks = selectedTags.size
    ? bookmarks.filter(bookmark =>
      !selectedTags
        .intersect(Immutable.Set(bookmark['book:hasTopic']))
        .isEmpty()
    )
    : bookmarks
  return <BookmarksList bookmarks={filteredBookmarks} />
}

const mapStateToProps = state => ({
  selectedTags: state.filters.selectedTags
})

export default connect(mapStateToProps)(FilteredBookmarksList)
