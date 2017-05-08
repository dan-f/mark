import React from 'react'

import Tag from './Tag'

const Bookmark = ({ title, url, tags, comments, onClickEdit, handleSelectTag }) =>
  <div className='w-100'>
    <div className='bookmark-title-row row'>
      <div className='col'>
        <div className='row'>
          <div className='col-6'>
            <h5><a href={url} target='_blank'>{title}</a></h5>
          </div>
          <div className='col-6' style={{textAlign: 'right'}}>
            {tags.map(tag =>
              <Tag key={tag} tag={tag} handleSelect={handleSelectTag} />
            )}
          </div>
        </div>
      </div>
    </div>
    <div className='bookmark-description row'>
      <div className='col'>
        <p>{comments}</p>
      </div>
    </div>
    <div className='bookmark-actions row'>
      <div className='bookmark-edit col'>
        <button type='button' className='btn btn-secondary' onClick={onClickEdit}>Edit</button>
      </div>
    </div>
  </div>

export default Bookmark
