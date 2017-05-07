import React from 'react'
import Loadable from 'react-loading-overlay'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import FilterableBookmarksList from './FilterableBookmarksList'
import NewBookmarkEditor from './NewBookmarkEditor'

class BookmarksListManager extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }

  componentDidMount () {
    const { bookmarksContainer } = this.props.match.params
    this.loadBookmarks(bookmarksContainer)
  }

  componentDidUpdate (prevProps) {
    const { bookmarksContainer: newBookmarksContainer } = this.props.match.params
    const { bookmarksContainer: oldBookmarksContainer } = prevProps.match.params
    if (newBookmarksContainer !== oldBookmarksContainer) {
      this.loadBookmarks(newBookmarksContainer)
    }
  }

  loadBookmarks (bookmarksContainer) {
    const { actions } = this.props
    this.setState({ loading: true })
    const loadedBookmarks = () => this.setState({ loading: false })
    actions.loadBookmarks(bookmarksContainer)
      .then(loadedBookmarks)
      .catch(loadedBookmarks)
  }

  render () {
    const { loading } = this.state
    return (
      <Loadable active={loading} spinner background='#FFFFFF' color='#000'>
        <NewBookmarkEditor />
        <FilterableBookmarksList />
      </Loadable>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.loading
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksListManager)
