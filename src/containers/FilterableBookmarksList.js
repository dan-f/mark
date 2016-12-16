import React from 'react'

import BookmarksFilter from './BookmarksFilter'
import EditableBookmarksList from './EditableBookmarksList'

export default function FilterableBookmarksList () {
  return (
    <div>
      <BookmarksFilter />
      <EditableBookmarksList />
    </div>
  )
}
