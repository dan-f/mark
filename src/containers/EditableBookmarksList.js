import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import BookmarkEditor from './BookmarkEditor'
import BookmarkListItem from '../components/BookmarkListItem'

export class EditableBookmarksList extends React.Component {
  constructor (props) {
    super(props)
    this.getVisibleBookmarks = this.getVisibleBookmarks.bind(this)
    this.onClickEditBookmark = this.onClickEditBookmark.bind(this)
    this.onClickCancelEditing = this.onClickCancelEditing.bind(this)
  }

  getVisibleBookmarks () {
    const { bookmarks, showArchived, selectedTags } = this.props
    return bookmarks.filter(bookmark => {
      const model = bookmark.model
      const canShowBasedOnTag = selectedTags.size ? selectedTags.intersect(model.get('tags')).size > 0 : true
      // const canShowBasedOnArchive = showArchived ? true : !model.any('archived')
      // return canShowBasedOnTag && canShowBasedOnArchive
      return canShowBasedOnTag
    })
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
      <div className='row'>
        <div className='col-xs-12'>
          <ul className='list-group'>
            {this.getVisibleBookmarks().valueSeq().map(bookmark =>
              bookmark.isEditing
                ? <li className='list-group-item' key={bookmark.model.any('url')}>
                    <BookmarkEditor
                      key={bookmark.model.any('url')}
                      model={bookmark.model}
                      handleCancel={this.onClickCancelEditing(bookmark.model)}
                    />
                  </li>
                : <BookmarkListItem
                    key={bookmark.model.any('url')}
                    title={bookmark.model.any('title')}
                    url={bookmark.model.any('url')}
                    tags={bookmark.model.get('tags')}
                    comments={bookmark.model.any('description')}
                    onClickEdit={this.onClickEditBookmark(bookmark.model)}
                  />
            )}
          </ul>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    bookmarks: state.bookmarks
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableBookmarksList)
