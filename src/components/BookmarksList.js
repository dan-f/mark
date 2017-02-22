import React from 'react'

import Bookmark from './Bookmark'
import ListGroup from './ListGroup'
import ListItem from './ListItem'
import BookmarkEditor from '../containers/BookmarkEditor'

export default function BookmarksList ({ bookmarks, handleCancelEditing, handleClickEdit, handleClickShare, handleSelectTag }) {
  return (
    <ListGroup>
      {bookmarks.map(bookmark => {
        const model = bookmark.get('model')
        return bookmark.get('isEditing')
          ? <ListItem key={model.any('url')}>
            <BookmarkEditor
              key={model.any('url')}
              model={model}
              handleCancel={handleCancelEditing(model)}
            />
          </ListItem>
          : <ListItem key={model.any('url')}>
            <Bookmark
              title={model.any('title')}
              url={model.any('url')}
              tags={model.get('tags')}
              comments={model.any('description')}
              onClickEdit={handleClickEdit(model)}
              onClickShare={handleClickShare(model)}
              handleSelectTag={handleSelectTag}
            />
          </ListItem>
      })}
    </ListGroup>
  )
}
