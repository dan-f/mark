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
  <section aria-label='Bookmark filter controls'>

    <div className='row'>
      <div className='col-6'>
        <form role='search' className='form-inline' onSubmit={event => event.preventDefault()}>
          <div className='form-group'>
            <label className='sr-only' htmlFor='tag-filter-input'>Bookmark filter typeahead</label>
            <Dropdown open={!!tagFilterInput && !!matchingTags.size}>
              <input type='text' role='searchbox' aria-autocomplete='list' className='form-control' id='tag-filter-input' placeholder='Filter by tag' value={tagFilterInput} autoComplete='off' onChange={handleTagFilterInput} />
              {matchingTags.map(tag =>
                <DropdownItem key={tag}>
                  <button aria-label={`Add ${tag} to active tags`} type='button' className='dropdown-item' onClick={handleSelectTag(tag)}>
                    {tag}
                  </button>
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

    <section aria-label='Active tags' className='my-2'>
      {selectedTags.map(tag =>
        <Tag aria-label={`Remove ${tag} from active tags`} key={tag} tag={tag} handleSelect={handleRemoveTag}>
          {tag} <i className='fa fa-times' aria-hidden='true' />
        </Tag>
      )}
    </section>

  </section>

export default BookmarksFilterControls
