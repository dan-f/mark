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
  }

  getVisibleBookmarks () {
    const { bookmarks, selectedTags } = this.props
    return bookmarks.filter(bookmark => {
      const model = bookmark.model
      const canShowBasedOnTag = selectedTags.size ? selectedTags.intersect(model.get('tags')).size > 0 : true
      // const canShowBasedOnArchive = showArchived ? true : !model.any('archived')
      // return canShowBasedOnTag && canShowBasedOnArchive
      return canShowBasedOnTag
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

  render () {
    return (
      <BookmarksList
        bookmarks={this.getVisibleBookmarks()}
        handleCancelEditing={this.onClickCancelEditing}
        handleClickEdit={this.onClickEditBookmark}
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    bookmarks: state.bookmarks,
    selectedTags: state.filters.selectedTags
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableBookmarksList)
