import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

export function NewBookmarkButton ({ actions, match, loggedIn, newBookmark }) {
  const { bookmarksContainer } = match.params
  const alreadyEditing = newBookmark !== null
  if (!loggedIn) {
    return null
  }
  return !alreadyEditing
    ? <button type='button' aria-label='Add a new bookmark' className='btn btn-sm btn-outline mx-1' onClick={() => actions.createAndEditNew(bookmarksContainer)}>
      <i className='fa fa-plus' aria-hidden='true' />
      <span className='mx-1'>Add a bookmark</span>
    </button>
    : null
}

function mapStateToProps (state) {
  const newBookmarkEntry = state.bookmarks.find(bookmark => bookmark.get('isNew'))
  return {
    loggedIn: !!state.auth.session,
    newBookmark: newBookmarkEntry ? newBookmarkEntry.model : null
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewBookmarkButton))
