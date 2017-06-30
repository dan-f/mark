import React from 'react'

export default function Tag ({ tag, handleSelect, 'aria-label': ariaLabel, children }) {
  return (
    <span aria-label={ariaLabel} role='button' tabIndex='0' className='btn badge badge-default' style={{marginRight: '0.4em'}} onClick={handleSelect(tag)} onKeyUp={handleSelect(tag)} onKeyDown={event => event.key === ' ' ? event.preventDefault() : null}>
      {children || tag}
    </span>
  )
}
