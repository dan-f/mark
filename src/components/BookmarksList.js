import React from 'react'

import BookmarkListItem from './BookmarkListItem'

export default class BookmarksList extends React.Component {
  constructor (props) {
    super(props)
    this.getVisibleBookmarks = this.getVisibleBookmarks.bind(this)
  }

  getVisibleBookmarks () {
    const { bookmarks, showArchived, selectedTags } = this.props
    return bookmarks.filter(bookmark => {
      const canShowBasedOnTag = selectedTags.size ? selectedTags.intersect(bookmark.tags).size > 0 : true
      const canShowBasedOnArchive = showArchived ? true : !bookmark.archived
      return canShowBasedOnTag && canShowBasedOnArchive
    })
  }

  render () {
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <ul className='list-group'>
            {this.getVisibleBookmarks().map(bookmark =>
              <BookmarkListItem
                key={bookmark.url}
                title={bookmark.title}
                url={bookmark.url}
                tags={bookmark.tags}
                comments={bookmark.comments}
                />
            )}
          </ul>
        </div>
      </div>
    )
  }
}
