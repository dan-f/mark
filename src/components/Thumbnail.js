import React from 'react'

export default function Thumbnail ({ imgUrl, imgAlt, name }) {
  return (
    <div>
      <img className='rounded' src={imgUrl} width='50' alt={imgAlt} />
      <span>{name}</span>
    </div>
  )
}
