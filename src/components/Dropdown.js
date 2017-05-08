import React from 'react'

const Dropdown = ({ children, open, ariaLabel }) =>
  <div className={'dropdown' + (open ? ' show' : '')}>
    {children[0]}
    <div className='dropdown-menu' aria-label={ariaLabel}>
      {children.slice(1)}
    </div>
  </div>

export default Dropdown
