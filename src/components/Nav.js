import React from 'react'

import './Nav.css'

import ProfileControls from '../containers/ProfileControls'

const Nav = () =>
  <nav aria-labelledby='mark-brand' className='navbar sticky-top navbar-inverse bg-inverse mb-2 d-flex flex-row justify-content-between'>
    <a href='/' className='navbar-brand'>
      <h1 id='mark-brand'>Mark <span className='sr-only'>homepage</span></h1>
    </a>
    <div className='d-flex p-1'>
      <ProfileControls />
    </div>
  </nav>

export default Nav
