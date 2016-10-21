import React from 'react'

export default function BookmarkListItem ({ title, url, tags, comments }) {
  return (
    <li className='list-group-item'>
      <div className='bookmark-title-row row'>
        <div className='col-xs-12'>
          {tags.map(tag =>
            <span key={tag} className='tag tag-default pull-xs-right' style={{marginLeft: '0.4em'}}>
              {tag}
            </span>
          )}
          <h5><a href={url} target='_blank'>{title}</a></h5>
        </div>
      </div>
      <div className='bookmark-description row'>
        <div className='col-xs-12'>
          <p>{comments}</p>
        </div>
      </div>
      <div className='bookmark-actions row'>
        <div className='bookmark-edit col-xs-12'>
          <button type='button' className='btn btn-secondary'>Edit</button>
        </div>
      </div>
    </li>
  )
}
