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
            title: 'JSON-LD',
            url: 'http://json-ld.org/',
            tags: ['JSON-LD', 'Linked Data'],
            comments: 'JSON-LD home page'
          }
        ]}
      />
    </div>
  )
}
