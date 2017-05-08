import React from 'react'

import Dropdown from './Dropdown'
import DropdownItem from './DropdownItem'
import Tag from './Tag'

const BookmarksFilterControls = ({
  selectedTags,
  tagFilterInput,
  matchingTags,
  showArchived,
  handleSelectTag,
  handleRemoveTag,
  handleTagFilterInput,
  handleShowArchived
}) =>
  <div>

    <div className='row'>
      <div className='col-6'>
        <form className='form-inline' onSubmit={event => event.preventDefault()}>
          <div className='form-group'>
            <label className='sr-only' htmlFor='tag-filter-input'>Filter by tag</label>
            <Dropdown open={tagFilterInput && matchingTags.size}>
              <input type='text' className='form-control' id='tag-filter-input' placeholder='Filter by tag' value={tagFilterInput} autoComplete='off' onChange={handleTagFilterInput} />
              {matchingTags.map(tag =>
                <DropdownItem key={tag}>
                  <button type='button' className='dropdown-item' onClick={handleSelectTag(tag)}>{tag}</button>
                </DropdownItem>
              )}
            </Dropdown>
          </div>
        </form>
      </div>

      <div className='col-6' style={{textAlign: 'right'}}>
        <form>
          <label className='custom-control custom-checkbox'>
            <input type='checkbox' className='custom-control-input' checked={showArchived} onChange={handleShowArchived} />
            <span className='custom-control-indicator' />
            <span className='custom-control-description'>Show archived</span>
          </label>
        </form>
      </div>
    </div>

    <div className='row' style={{marginTop: '5px', marginBottom: '5px'}}>
      <div className='col-12'>
        {selectedTags.map(tag =>
          <Tag key={tag} tag={tag} handleSelect={handleRemoveTag} />
        )}
      </div>
    </div>

  </div>

export default BookmarksFilterControls
