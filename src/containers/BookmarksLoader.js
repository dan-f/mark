import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import FilterableBookmarksList from './FilterableBookmarksList'
import BookmarkCreator from './BookmarkCreator'

class BookmarksLoader extends React.Component {
  componentDidMount () {
    const {actions, webId} = this.props
    const {bookmarksUrl} = this.props.params
    actions.loadBookmarks(bookmarksUrl, webId)
  }

  render () {
    const {bookmarks} = this.props
    return (
      <div>
        <BookmarkCreator />
        <FilterableBookmarksList bookmarks={bookmarks} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    bookmarks: state.bookmarks,
    webId: state.auth.webId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksLoader)
