import React from 'react'

import BookmarkListItem from './BookmarkListItem'
import BookmarkEditor from '../containers/BookmarkEditor'

export default function BookmarksList ({ bookmarks, handleCancelEditing, handleClickEdit }) {
  return (
    <div className='row'>
      <div className='col-xs-12'>
        <ul className='list-group'>
          {bookmarks.map(bookmark =>
              bookmark.isEditing
                ? <li className='list-group-item' key={bookmark.model.any('url')}>
                  <BookmarkEditor
                    key={bookmark.model.any('url')}
                    model={bookmark.model}
                    handleCancel={handleCancelEditing(bookmark.model)}
                  />
                </li>
                : <BookmarkListItem
                  key={bookmark.model.any('url')}
                  title={bookmark.model.any('title')}
                  url={bookmark.model.any('url')}
                  tags={bookmark.model.get('tags')}
                  comments={bookmark.model.any('description')}
                  onClickEdit={handleClickEdit(bookmark.model)}
                />
            )}
        </ul>
      </div>
    </div>
  )
}
