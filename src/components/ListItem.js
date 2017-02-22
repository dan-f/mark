import React from 'react'

export default function ListItem ({ children }) {
  return (
    <li className='list-group-item'>
      {children}
    </li>
  )
}
