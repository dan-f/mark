import React from 'react'

const BookmarkForm = ({
  title,
  url,
  tags,
  description,
  isValid,
  archived,
  handleChangeTitle,
  handleChangeUrl,
  handleChangeTags,
  handleChangeDescription,
  handleChangeArchived,
  handleSubmit,
  handleCancel
}) =>
  <div className='row w-100'>
    <div className='col'>
      <form onSubmit={handleSubmit}>
        <div className='form-group row'>
          <label htmlFor='title-input' className='col-sm-3 col-form-label'>Title:</label>
          <div className='col-sm-9'>
            <input type='text' className='form-control' id='title-input' value={title} onChange={handleChangeTitle} />
          </div>
        </div>
        <div className='form-group row'>
          <label htmlFor='url-input' className='col-sm-3 col-form-label'>URL:</label>
          <div className='col-sm-9'>
            <input type='url' className='form-control' id='url-input' value={url} onChange={handleChangeUrl} />
          </div>
        </div>
        <div className='form-group row'>
          <label htmlFor='tag-input' className='col-sm-3 col-form-label'>Tags:</label>
          <div className='col-sm-9'>
            <input type='text' className='form-control' id='tag-input' value={tags} onChange={handleChangeTags} />
          </div>
        </div>
        <div className='form-group row'>
          <label htmlFor='description-textarea' className='col-sm-3 col-form-label'>Description:</label>
          <div className='col-sm-9'>
            <textarea className='form-control' rows='3' id='description-textarea' value={description} onChange={handleChangeDescription} />
          </div>
        </div>
        <div className='form-group row'>
          <div className='col'>
            <label className='custom-control custom-checkbox'>
              <input type='checkbox' className='custom-control-input' checked={archived} onChange={handleChangeArchived} />
              <span className='custom-control-indicator' />
              <span className='custom-control-description col-sm-3'>Archived</span>
            </label>
          </div>
        </div>
        <div className='form-group row'>
          <div className='col-6 col-sm-3'>
            <button type='submit' className='btn btn-primary' disabled={!isValid}>Submit</button>
          </div>
          <div className='col-6 col-sm-3'>
            <button type='reset' className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>

export default BookmarkForm
