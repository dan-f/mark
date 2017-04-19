import React from 'react'

export default ({ type, heading, message, onDismiss }) =>
  heading || message
    ? (
      <div className={`alert alert-${type}`} role='alert'>
        <button type='button' className='close' aria-label='Close' onClick={onDismiss}>
          <span aria-hidden='true'>&times;</span>
        </button>
        <h4>{heading}</h4>
        {message}
      </div>
    )
    : null
