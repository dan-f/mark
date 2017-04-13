import React from 'react'

import Tag from './Tag'

export default function BookmarkListItem ({ title, url, tags, comments, onClickEdit, handleSelectTag }) {
  return (
    <li className='list-group-item d-flex flex-column align-items-start'>
      <div className='bookmark-title-row d-flex flex-row w-100 justify-content-between'>
        <div>
          <h5><a href={url} target='_blank'>{title}</a></h5>
        </div>
        <div>
          {tags.map(tag =>
            <Tag key={tag} tag={tag} handleSelect={handleSelectTag} />
          )}
        </div>
      </div>
      <div className='bookmark-description'>
        <div className='col-xs-12'>
          <p>{comments}</p>
        </div>
      </div>
      <div className='bookmark-actions'>
        <div className='bookmark-edit col-xs-12'>
          <button type='button' className='btn btn-secondary' onClick={onClickEdit}>Edit</button>
        </div>
      </div>
    </li>
  )
}
