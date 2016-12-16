import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import BookmarksList from '../components/BookmarksList'

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
      const model = bookmark.model
      const tagInFilters = selectedTags.size ? selectedTags.intersect(model.get('tags')).size > 0 : true
      const fulfillsArchiveFilter = showArchived ? true : !model.any('archived')
      const isNotNew = !bookmark.isNew
      return tagInFilters && fulfillsArchiveFilter && isNotNew
    }).valueSeq()
  }

  onClickEditBookmark (bookmarkModel) {
    const {actions} = this.props
    return (event) => {
      actions.edit(bookmarkModel)
    }
  }

  onClickCancelEditing (bookmarkModel) {
    const {actions} = this.props
    return (event) => {
      actions.cancelEdit(bookmarkModel)
    }
  }

  handleSelectTag (tag) {
    const {actions} = this.props
    return event => {
      if (event.type !== 'click' && !(event.type === 'keyup' && event.key === ' ')) {
        return
      }
      actions.addFilterTag(tag)
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
