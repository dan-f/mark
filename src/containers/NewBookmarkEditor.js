import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import BookmarkEditor from './BookmarkEditor'

export function NewBookmarkEditor ({ newBookmark, actions }) {
  if (newBookmark !== null) {
    return (
      <BookmarkEditor
        model={newBookmark}
        handleCancel={() => actions.cancelEdit(newBookmark)}
        afterSubmit={() => {}}
      />
    )
  } else {
    return <div />
  }
}

function mapStateToProps (state) {
  const newBookmarkEntry = state.bookmarks.find(bookmark => bookmark.isNew)
  return {
    newBookmark: newBookmarkEntry ? newBookmarkEntry.model : null
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBookmarkEditor)
