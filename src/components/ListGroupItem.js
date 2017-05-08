import React from 'react'

const ListGroupItem = ({ children }) =>
  <li className='list-group-item'>
    <div className='w-100'>
      {children}
    </div>
  </li>

export default ListGroupItem
