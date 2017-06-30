import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import BookmarksList from '../components/BookmarksList'
import { buttonSelected } from '../utils'

export class EditableBookmarksList extends React.Component {
  constructor (props) {
    super(props)
    this.getVisibleBookmarks = this.getVisibleBookmarks.bind(this)
    this.onClickEditBookmark = this.onClickEditBookmark.bind(this)
    this.onClickCancelEditing = this.onClickCancelEditing.bind(this)
    this.handleSelectTag = this.handleSelectTag.bind(this)
  }

  getVisibleBookmarks () {
    const { bookmarks, selectedTags, showArchived } = this.props
    return bookmarks.filter(bookmark => {
      const data = bookmark.get('data')
      const tags = data.get('book:hasTopic').map(topic => topic.get('@value'))
      const tagInFilters = selectedTags.size ? selectedTags.intersect(tags).size > 0 : true
      const fulfillsArchiveFilter = showArchived
        ? true
        : !JSON.parse(data.getIn(['solid:read', '@value']))
      const isNotNew = !bookmark.get('isNew')
      return tagInFilters && fulfillsArchiveFilter && isNotNew
    }).valueSeq()
  }

  onClickEditBookmark (bookmark) {
    const { actions } = this.props
    return event => actions.edit(bookmark)
  }

  onClickCancelEditing (bookmark) {
    const { actions } = this.props
    return event => actions.cancelEdit(bookmark)
  }

  handleSelectTag (tag) {
    const { actions } = this.props
    return event => {
      if (buttonSelected(event)) {
        actions.addFilterTag(tag)
      }
    }
  }

  render () {
    return (
      <BookmarksList
        bookmarks={this.getVisibleBookmarks()}
        handleCancelEditing={this.onClickCancelEditing}
        handleClickEdit={this.onClickEditBookmark}
        handleSelectTag={this.handleSelectTag}
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    bookmarks: state.bookmarks,
    selectedTags: state.filters.selectedTags,
    showArchived: state.filters.showArchived
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableBookmarksList)
