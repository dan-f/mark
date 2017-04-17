import React from 'react'

import Tag from './Tag'

export default ({
  'dc:title': title,
  'dc:description': description,
  'book:recalls': url,
  'book:hasTopic': tags,
  onClickEdit = () => {},
  handleSelectTag = () => {}
}) =>
  <div className='w-100'>
    <div className='bookmark-title-row d-flex flex-row justify-content-between'>
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
        <p>{description}</p>
      </div>
    </div>
    <div className='bookmark-actions'>
      <div className='bookmark-edit col-xs-12'>
        <button type='button' className='btn btn-secondary' onClick={onClickEdit}>Edit</button>
      </div>
    </div>
  </div>
