import React from 'react'
import { Link } from 'react-router-dom'

import ProfileControls from '../containers/ProfileControls'

const Nav = () =>
  <nav className='navbar sticky-top navbar-inverse bg-inverse mb-2 d-flex flex-row justify-content-between'>
    <Link to='/m/' className='navbar-brand'>Mark</Link>
    <div className='d-flex p-1'>
      <ProfileControls />
    </div>
  </nav>

export default Nav
