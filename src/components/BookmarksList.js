import React from 'react'

import Bookmark from './Bookmark'

export default ({ bookmarks }) =>
  <ul className='list-group'>
    {bookmarks.map(bookmark =>
      <li className='list-group-item d-flex flex-column align-items-start' key={bookmark['book:recalls']}>
        <Bookmark {...bookmark} />
      </li>
    )}
  </ul>
