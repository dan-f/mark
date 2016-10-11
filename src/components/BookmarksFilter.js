import React from 'react'

export default class BookmarksFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {tagFilterInput: ''}
    this.handleTagFilterInput = this.handleTagFilterInput.bind(this)
    this.getMatchingTags = this.getMatchingTags.bind(this)
  }

  handleTagFilterInput (event) {
    this.setState({tagFilterInput: event.target.value})
  }

  getMatchingTags () {
    return this.props.tags.filter(tag =>
      !this.props.selectedTags.has(tag) &&
      tag.toLowerCase().startsWith(this.state.tagFilterInput.toLowerCase())
    )
  }

  render () {
    const {showArchived, handleToggleShowArchived, selectedTags, handleSelectTag} = this.props
    return (
      <div>

        <div className='row'>
          <div className='col-xs-12'>
            <form>
              <label className='form-check-inline'>
                <input type='checkbox' className='form-check-input' checked={showArchived} onClick={handleToggleShowArchived} />
                <span>Show archived</span>
              </label>
            </form>
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12'>
            {selectedTags.map(tag =>
              <span key={tag} className='tag tag-default' style={{marginLeft: '0.4em'}}>
                {tag}
              </span>
            )}
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12'>
            <form className='form-inline'>
              <div className='form-group'>
                <label className='sr-only' htmlFor='tag-filter-input'>Filter by tag</label>
                <div className={'dropdown ' + (this.state.tagFilterInput ? 'open' : '')}>
                  <input type='text' className='form-control' id='tag-filter-input' placeholder='Filter by tag' autoComplete='off' onChange={this.handleTagFilterInput} />
                  <div className='dropdown-menu'>
                    {this.getMatchingTags().map(tag =>
                      <button key={tag} className='dropdown-item' onClick={handleSelectTag(tag)}>{tag}</button>
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
}
