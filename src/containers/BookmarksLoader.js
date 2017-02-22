import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import FilterableBookmarksList from './FilterableBookmarksList'
import NewBookmarkEditor from './NewBookmarkEditor'
import BookmarkShareWidget from './BookmarkShareWidget'
import Header from '../components/Header'

class BookmarksLoader extends React.Component {
  componentDidMount () {
    const {actions} = this.props
    const {bookmarksUrl} = this.props.params
    actions.loadBookmarks(bookmarksUrl)
  }

  render () {
    return (
      <div>
        <Header />
        <NewBookmarkEditor />
        <FilterableBookmarksList />
        <BookmarkShareWidget />
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
