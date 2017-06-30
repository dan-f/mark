import React, { cloneElement } from 'react'
import uuid from 'uuid'

const Dropdown = ({ children, open }) => {
  const menuId = `dropdown-menu-${uuid.v4()}`
  return (
    <div className={'dropdown' + (open ? ' show' : '')}>
      {cloneElement(children[0], {
        'aria-label': children[0].props['aria-label'] || 'Dropdown toggle',
        'aria-expanded': open,
        'aria-controls': menuId,
        'aria-haspopup': true
      })}
      <ul role='menu' id={menuId} className='dropdown-menu'>
        {children.slice(1)}
      </ul>
    </div>
  )
}

export default Dropdown
