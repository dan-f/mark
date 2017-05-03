import React from 'react'

import BookmarkListItem from './BookmarkListItem'
import BookmarkEditor from '../containers/BookmarkEditor'

export default function BookmarksList ({ bookmarks, handleCancelEditing, handleClickEdit, handleSelectTag }) {
  return (
    <div className='row'>
      <div className='col-xs-12'>
        <ul className='list-group'>
          {bookmarks.map(bookmark =>
              bookmark.get('isEditing')
                ? <li className='list-group-item' key={bookmark.getIn(['data', 'book:recalls', '@id'])}>
                  <BookmarkEditor
                    key={bookmark.getIn(['data', 'book:recalls', '@id'])}
                    bookmark={bookmark}
                    handleCancel={handleCancelEditing(bookmark)}
                  />
                </li>
                : <BookmarkListItem
                  key={bookmark.getIn(['data', 'book:recalls', '@id'])}
                  title={bookmark.getIn(['data', 'dc:title'])}
                  url={bookmark.getIn(['data', 'book:recalls', '@id'])}
                  tags={bookmark.getIn(['data', 'book:hasTopic'])}
                  comments={bookmark.getIn(['data', 'dc:description'])}
                  onClickEdit={handleClickEdit(bookmark)}
                  handleSelectTag={handleSelectTag}
                />
            )}
        </ul>
      </div>
    </div>
  )
}
