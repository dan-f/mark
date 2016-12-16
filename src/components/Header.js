import React from 'react'

import NewBookmarkButton from '../containers/NewBookmarkButton'

export default function Header () {
  return (
    <div className='row'>
      <div className='col-xs-8'>
        <h1>Solid Bookmarks</h1>
      </div>
      <div className='col-xs-4'>
        <span className='pull-xs-right' style={{marginTop: '10px'}}>
          <NewBookmarkButton />
        </span>
      </div>
    </div>
  )
}
