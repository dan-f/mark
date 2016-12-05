import React from 'react'

export default function BookmarksFilterControls ({
  selectedTags,
  tagFilterInput,
  matchingTags,
  handleSelectTag,
  handleRemoveTag,
  handleTagFilterInput
}) {
  return (
    <div>

      {/*
      <div className='row'>
        <div className='col-xs-12'>
          <form>
            <label className='form-check-inline'>
              <input type='checkbox' className='form-check-input' checked={showArchived} onClick={toggleShowArchived} />
              <span>Show archived</span>
            </label>
          </form>
        </div>
      </div>
      */}

      <div className='row'>
        <div className='col-xs-12'>
          {selectedTags.map(tag =>
            <span key={tag} role='button' tabIndex='0' className='btn tag tag-default' style={{marginLeft: '0.4em'}} onClick={handleRemoveTag(tag)} onKeyUp={handleRemoveTag(tag)}>
              {tag}
            </span>
          )}
        </div>
      </div>

      <div className='row'>
        <div className='col-xs-12'>
          <form className='form-inline' onSubmit={event => event.preventDefault()}>
            <div className='form-group'>
              <label className='sr-only' htmlFor='tag-filter-input'>Filter by tag</label>
              <div className={'dropdown ' + (tagFilterInput && matchingTags.size ? 'open' : '')}>
                <input type='text' className='form-control' id='tag-filter-input' placeholder='Filter by tag' value={tagFilterInput} autoComplete='off' onChange={handleTagFilterInput} />
                <div className='dropdown-menu'>
                  {matchingTags.map(tag =>
                    <button key={tag} type='button' className='dropdown-item' onClick={handleSelectTag(tag)}>{tag}</button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}
