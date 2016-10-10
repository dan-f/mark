import React from 'react'

import BookmarkListItem from './BookmarkListItem'

export default function BookmarksList ({ bookmarks }) {
  return (
    <div className='row'>
      <div className='col-xs-12'>
        <ul className='list-group'>
          {bookmarks.map(bookmark =>
            <BookmarkListItem
              key={bookmark.id}
              title={bookmark.title}
              url={bookmark.url}
              tags={bookmark.tags}
              comments={bookmark.comments}
            />
          )}
        </ul>
      </div>
    </div>
  )
}
