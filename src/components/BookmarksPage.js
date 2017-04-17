import React from 'react'

import BookmarksFilter from '../twinql-containers/BookmarksFilter'
import BookmarksList from '../twinql-containers/BookmarksList'

export default ({ match: { params: { bookmarksContainer } } }) =>
  <div>
    <BookmarksFilter bookmarksContainer={bookmarksContainer} />
    <BookmarksList bookmarksContainer={bookmarksContainer} />
  </div>
