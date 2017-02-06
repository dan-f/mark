import React from 'react'

import Tag from './Tag'

export default function BookmarkListItem ({ title, url, tags, comments, onClickEdit, handleSelectTag }) {
  return (
    <li className='list-group-item'>
      <div className='bookmark-title-row row'>
        <div className='col-xs-12'>
          <div className='row'>
            <div className='col-xs-6'>
              <h5><a href={url} target='_blank'>{title}</a></h5>
            </div>
            <div className='col-xs-6' style={{textAlign: 'right'}}>
              {tags.map(tag =>
                <Tag key={tag} tag={tag} handleSelect={handleSelectTag} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='bookmark-description row'>
        <div className='col-xs-12'>
          <p>{comments}</p>
        </div>
      </div>
      <div className='bookmark-actions row'>
        <div className='bookmark-edit col-xs-6'>
          <button type='button' className='btn btn-secondary' onClick={onClickEdit}>Edit</button>
        </div>
        <div className='bookmark-edit col-xs-6' style={{textAlign: 'right'}}>
          <button type='button' className='btn btn-link'>Share</button>
        </div>
      </div>
    </li>
  )
}
