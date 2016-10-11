import React from 'react'

export default function BookmarkForm () {
  return (
    <div className='row'>
      <div className='col-xs-12'>
        <span>Add a bookmark</span>
        <form>
          <div className='form-group row'>
            <label htmlFor='title-input' className='col-xs-3 col-sm-2 col-form-label'>Title:</label>
            <div className='col-xs-10'>
              <input type='text' className='form-control' id='title-input' />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='url-input' className='col-xs-3 col-sm-2 col-form-label'>URL:</label>
            <div className='col-xs-10'>
              <input type='url' className='form-control' id='url-input' />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='tag-input' className='col-xs-3 col-sm-2 col-form-label'>Tags:</label>
            <div className='col-xs-10'>
              <input type='text' className='form-control' id='tag-input' />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='comments-textarea' className='col-xs-3 col-sm-2 col-form-label'>Comments:</label>
            <div className='col-xs-10'>
              <textarea className='form-control' rows='3' id='comments-textarea' />
            </div>
          </div>
          <div className='form-group row'>
            <div className='col-xs-6 col-sm-3'>
              <button type='submit' className='btn btn-primary'>Add Bookmark</button>
            </div>
            <div className='col-xs-6 col-sm-3'>
              <button type='cancel' className='btn btn-secondary'>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
