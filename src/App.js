import React from 'react'

import BookmarkForm from './components/BookmarkForm'
import BookmarksList from './components/BookmarksList'

export default function App () {
  return (
    <div>
      <BookmarkForm />
      <BookmarksList
        bookmarks={[
          {
            id: 0,
            title: 'JSON-LD',
            url: 'http://json-ld.org/',
            tags: [{id: 0, name: 'JSON-LD'}, {id: 1, name: 'Linked Data'}],
            comments: 'JSON-LD home page'
          }
        ]}
      />
    </div>
  )
}
