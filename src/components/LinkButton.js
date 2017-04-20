import React from 'react'

export default ({ message, onClick, className = '' }) =>
  <button className={`btn btn-link ${className}`} onClick={onClick}>{message}</button>
