import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import BookmarkEditor from './BookmarkEditor'

export function NewBookmarkEditor ({ bookmark, actions }) {
  if (bookmark !== null) {
    return (
      <BookmarkEditor
        bookmark={bookmark}
        handleCancel={() => actions.cancelEdit(bookmark)}
        afterSubmit={() => {}}
      />
    )
  } else {
    return <div />
  }
}

function mapStateToProps (state) {
  const newBookmark = state.bookmarks.find(bookmark => bookmark.get('isNew'))
  return {
    bookmark: newBookmark || null
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBookmarkEditor)
