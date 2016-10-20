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
      const canShowBasedOnTag = selectedTags.size ? selectedTags.intersect(bookmark.get('tags')).size > 0 : true
      // const canShowBasedOnArchive = showArchived ? true : !bookmark.any('archived')
      // return canShowBasedOnTag && canShowBasedOnArchive
      return canShowBasedOnTag
    })
  }

  render () {
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <ul className='list-group'>
            {this.getVisibleBookmarks().map(bookmark =>
              <BookmarkListItem
                key={bookmark.any('url')}
                title={bookmark.any('title')}
                url={bookmark.any('url')}
                tags={bookmark.get('tags')}
                comments={bookmark.any('description')}
              />
            )}
          </ul>
        </div>
      </div>
    )
  }
}
