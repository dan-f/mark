import React from 'react'

const DropdownItem = ({ children }) =>
  <div>
    {React.Children.map(children, child => React.cloneElement(child, { className: 'dropdown-item' }))}
  </div>

export default DropdownItem
