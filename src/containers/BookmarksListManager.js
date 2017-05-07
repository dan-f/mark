import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import Loading from '../components/Loading'
import FilterableBookmarksList from './FilterableBookmarksList'
import NewBookmarkEditor from './NewBookmarkEditor'

class BookmarksListManager extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }

  componentDidMount () {
    const { actions } = this.props
    const { bookmarksContainer } = this.props.match.params
    this.loadBookmarks(bookmarksContainer)
  }

  componentDidUpdate (prevProps) {
    const { bookmarksContainer: newBookmarksContainer } = this.props.match.params
    const { bookmarksContainer: oldBookmarksContainer } = prevProps.match.params
    if (newBookmarksContainer !== oldBookmarksContainer) {
      this.loadBookmarks(bookmarksContainer)
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
      <div>
        <NewBookmarkEditor />
        {loading
          ? <Loading />
          : <FilterableBookmarksList />
        }
      </div>
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
