import React from 'react'

export default function Tag ({ tag, handleSelect }) {
  return (
    <span role='button' tabIndex='0' className='btn tag tag-default' style={{marginLeft: '0.4em'}} onClick={handleSelect(tag)} onKeyUp={handleSelect(tag)} onKeyDown={event => event.key === ' ' ? event.preventDefault() : null}>
      {tag}
    </span>
  )
}
