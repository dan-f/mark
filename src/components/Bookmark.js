import React from 'react'

import Tag from './Tag'

export default function BookmarkListItem ({ title, url, tags, comments, onClickEdit, onClickShare, handleSelectTag }) {
  return (
    <div className='w-100'>
      <div className='d-flex justify-content-between'>
        <h5><a href={url} target='_blank'>{title}</a></h5>
        <div className='tags'>
          {tags.map(tag =>
            <Tag key={tag} tag={tag} handleSelect={handleSelectTag} />
          )}
        </div>
      </div>
      <div className='bookmark-description'>
        {comments}
      </div>
      <div className='bookmark-actions'>
        <button type='button' className='btn btn-secondary' onClick={onClickEdit}>Edit</button>
        <button type='button' className='btn btn-link' onClick={onClickShare}>Share</button>
      </div>
    </div>
  )
}
