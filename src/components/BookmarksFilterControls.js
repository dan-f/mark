import React from 'react'

import Tag from './Tag'

export default function BookmarksFilterControls ({
  selectedTags,
  tagFilterInput,
  matchingTags,
  showArchived,
  handleSelectTag,
  handleRemoveTag,
  handleTagFilterInput,
  handleShowArchived
}) {
  return (
    <div>

      <div className='row'>
        <div className='col-6'>
          <form className='form-inline' onSubmit={event => event.preventDefault()}>
            <div className='form-group'>
              <label className='sr-only' htmlFor='tag-filter-input'>Filter by tag</label>
              <div className={'dropdown ' + (tagFilterInput && matchingTags.size ? 'show' : '')}>
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

        <div className='col-6' style={{textAlign: 'right'}}>
          <form>
            <label className='form-check-inline'>
              <input type='checkbox' className='form-check-input' checked={showArchived} onChange={handleShowArchived} />
              <span>Show archived</span>
            </label>
          </form>
        </div>
      </div>

      <div className='row' style={{marginTop: '5px', marginBottom: '5px'}}>
        <div className='col'>
          {selectedTags.map(tag =>
            <Tag key={tag} tag={tag} handleSelect={handleRemoveTag} />
          )}
        </div>
      </div>

    </div>
  )
}
