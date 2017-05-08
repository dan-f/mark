import React from 'react'

import ProfileControls from '../containers/ProfileControls'

const Nav = () =>
  <nav className='navbar sticky-top navbar-inverse bg-inverse mb-2 d-flex flex-row justify-content-between'>
    <a href='/' className='navbar-brand'>Mark</a>
    <div className='d-flex p-1'>
      <ProfileControls />
    </div>
  </nav>

export default Nav
