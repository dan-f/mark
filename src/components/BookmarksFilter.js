import React from 'react'

export default class BookmarksFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {tagInputValue: ''}
  }

  render () {
    const {showArchived, handleToggleShowArchived} = this.props
    return (
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
    )
  }
}
