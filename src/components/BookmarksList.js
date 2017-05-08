import React from 'react'

import Bookmark from './Bookmark'
import ListGroup from './ListGroup'
import ListGroupItem from './ListGroupItem'
import BookmarkEditor from '../containers/BookmarkEditor'

const EmptyBookmarksListCopy = () =>
  <div>
    Looks like this list is empty.  Click "Add new bookmark" to add one!
  </div>

export default function BookmarksList ({ bookmarks, handleCancelEditing, handleClickEdit, handleSelectTag }) {
  return (
    <div className='row'>
      <div className='col'>
        <ListGroup>
          {bookmarks.size
            ? bookmarks.map(bookmark =>
              bookmark.get('isEditing')
                ? <ListGroupItem key={bookmark.getIn(['data', 'book:recalls', '@id'])}>
                  <BookmarkEditor
                    key={bookmark.getIn(['data', 'book:recalls', '@id'])}
                    bookmark={bookmark}
                    handleCancel={handleCancelEditing(bookmark)}
                  />
                </ListGroupItem>
                : <ListGroupItem key={bookmark.getIn(['data', 'book:recalls', '@id'])}>
                  <Bookmark
                    title={bookmark.getIn(['data', 'dc:title'])}
                    url={bookmark.getIn(['data', 'book:recalls', '@id'])}
                    tags={bookmark.getIn(['data', 'book:hasTopic'])}
                    comments={bookmark.getIn(['data', 'dc:description'])}
                    onClickEdit={handleClickEdit(bookmark)}
                    handleSelectTag={handleSelectTag}
                  />
                </ListGroupItem>
            )
            : <EmptyBookmarksListCopy />}
        </ListGroup>
      </div>
    </div>
  )
}
