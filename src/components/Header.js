import React from 'react'

import Error from '../containers/Error'
import Info from '../containers/Info'
import NewBookmarkButton from '../containers/NewBookmarkButton'

export default function Header () {
  return (
    <div>
      <div className='row'>
        <div className='col-xs-8'>
          <h1>Mark</h1>
        </div>
        <div className='col-xs-4'>
          <span className='pull-xs-right' style={{marginTop: '10px'}}>
            <NewBookmarkButton />
          </span>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12'>
          <Error />
          <Info />
        </div>
      </div>
    </div>
  )
}
