import React from 'react'

export default function BookmarkForm ({
  title,
  url,
  tags,
  description,
  isValid,
  handleChangeTitle,
  handleChangeUrl,
  handleChangeTags,
  handleChangeDescription,
  handleSubmit,
  handleCancel
}) {
  return (
    <div className='row'>
      <div className='col-xs-12'>
        <form onSubmit={handleSubmit}>
          <div className='form-group row'>
            <label htmlFor='title-input' className='col-xs-3 col-sm-2 col-form-label'>Title:</label>
            <div className='col-xs-10'>
              <input type='text' className='form-control' id='title-input' value={title} onChange={handleChangeTitle} />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='url-input' className='col-xs-3 col-sm-2 col-form-label'>URL:</label>
            <div className='col-xs-10'>
              <input type='url' className='form-control' id='url-input' value={url} onChange={handleChangeUrl} />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='tag-input' className='col-xs-3 col-sm-2 col-form-label'>Tags:</label>
            <div className='col-xs-10'>
              <input type='text' className='form-control' id='tag-input' value={tags} onChange={handleChangeTags} />
            </div>
          </div>
          <div className='form-group row'>
            <label htmlFor='description-textarea' className='col-xs-3 col-sm-2 col-form-label'>Description:</label>
            <div className='col-xs-10'>
              <textarea className='form-control' rows='3' id='description-textarea' value={description} onChange={handleChangeDescription} />
            </div>
          </div>
          <div className='form-group row'>
            <div className='col-xs-6 col-sm-3'>
              <button type='submit' className='btn btn-primary' disabled={!isValid}>Submit</button>
            </div>
            <div className='col-xs-6 col-sm-3'>
              <button type='reset' className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
