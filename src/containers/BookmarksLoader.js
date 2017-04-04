import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import FilterableBookmarksList from './FilterableBookmarksList'
import NewBookmarkEditor from './NewBookmarkEditor'

class BookmarksLoader extends React.Component {
  componentDidMount () {
    const {actions} = this.props
    const {bookmarksUrl} = this.props.match.params
    actions.loadBookmarks(bookmarksUrl)
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

export default connect(null, mapDispatchToProps)(BookmarksLoader)
