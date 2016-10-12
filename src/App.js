import React from 'react'

import BookmarkForm from './components/BookmarkForm'
import FilterableBookmarksList from './components/FilterableBookmarksList'

export default class App extends React.Component {
  render () {
    const {bookmarks} = this.props
    return (
      <div>
        <BookmarkForm />
        <FilterableBookmarksList bookmarks={bookmarks} />
      </div>
    )
  }
}
