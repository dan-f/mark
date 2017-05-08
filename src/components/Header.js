import React from 'react'

import Error from '../containers/Error'
import Info from '../containers/Info'
import NewBookmarkButton from '../containers/NewBookmarkButton'

export default function Header () {
  return (
    <div>
      <div className='row'>
        <div className='col-8'>
          <h1>Mark</h1>
        </div>
        <div className='col-4'>
          <span className='pull-right' style={{marginTop: '10px'}}>
            <NewBookmarkButton />
          </span>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <Error />
          <Info />
        </div>
      </div>
    </div>
  )
}
