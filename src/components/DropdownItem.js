import React from 'react'

const DropdownItem = ({ children }) =>
  <li role='menuitem'>
    {React.Children.map(children, child => React.cloneElement(child, { className: 'dropdown-item' }))}
  </li>

export default DropdownItem
