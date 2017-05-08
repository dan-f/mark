import React from 'react'

import NewBookmark from './NewBookmark'
import Bookmark from './Bookmark'
import ListGroup from './ListGroup'
import ListGroupItem from './ListGroupItem'
import BookmarkEditor from '../containers/BookmarkEditor'

export default function BookmarksList ({ bookmarks, handleCancelEditing, handleClickEdit, handleSelectTag }) {
  return (
    <div className='row'>
      <div className='col'>
        <ListGroup>
          <ListGroupItem>
            <NewBookmark />
          </ListGroupItem>
          {bookmarks.map(bookmark =>
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
            )}
        </ListGroup>
      </div>
    </div>
  )
}
