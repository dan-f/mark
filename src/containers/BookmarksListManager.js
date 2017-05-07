import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import FilterableBookmarksList from './FilterableBookmarksList'
import NewBookmarkEditor from './NewBookmarkEditor'

class BookmarksListManager extends React.Component {
  componentDidMount () {
    const { actions } = this.props
    const { bookmarksContainer } = this.props.match.params
    actions.loadBookmarks(bookmarksContainer)
  }

  componentDidUpdate (prevProps) {
    const { bookmarksContainer: newBookmarksContainer } = this.props.match.params
    const { bookmarksContainer: oldBookmarksContainer } = prevProps.match.params
    if (newBookmarksContainer !== oldBookmarksContainer) {
      actions.loadBookmarks(newBookmarksContainer)
    }
  }

  render () {
    return (
      <div>
        <NewBookmarkEditor />
        <FilterableBookmarksList />
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(BookmarksListManager)
