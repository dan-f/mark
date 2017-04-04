import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

export function NewBookmarkButton ({ actions, loggedIn, newBookmark }) {
  const alreadyEditing = newBookmark !== null
  return loggedIn
    ? <button type='button' className='btn btn-sm btn-outline-primary' disabled={alreadyEditing} onClick={() => actions.createAndEditNew()}>Add a new bookmark</button>
    : <div />
}

function mapStateToProps (state) {
  const newBookmarkEntry = state.bookmarks.find(bookmark => bookmark.isNew)
  return {
    loggedIn: !!state.auth.webId,
    newBookmark: newBookmarkEntry ? newBookmarkEntry.model : null
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBookmarkButton)
