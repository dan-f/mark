import React from 'react'

/**
 * A reasonably generic typeahead.  Requires the the set of "items" to select
 * from, and a callback for when an item is selected.
 *
 * The callback is called with the selected item as its argument.
 */
export default class Typeahead extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputText: ''
    }
    this.getMatchingItems = this.getMatchingItems.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)
  }

  handleChangeInput (event) {
    this.setState({ inputText: event.target.value })
  }

  render () {
    const { handleSelectItem, placeholder } = this.props
    const { inputText } = this.state
    const matchingItems = this.getMatchingItems()
    return (
      <form onSubmit={event => event.preventDefault()}>
        <div className={'dropdown ' + (matchingItems.length ? 'show' : '')}>
          <input type='text' className='form-control' autoComplete='off' placeholder={placeholder} value={inputText} onChange={this.handleChangeInput} />
          <div className='dropdown-menu'>
            {matchingItems.map(item =>
              <button key={item} type='button' className='dropdown-item' onClick={handleSelectItem(item)}>
                {item}
              </button>
            )}
          </div>
        </div>
      </form>
    )
  }

  getMatchingItems () {
    const { items } = this.props
    return items.filter(this.matchPredicate)
  }

  get matchPredicate () {
    const { inputText } = this.state
    const cleanedInput = this.clean(inputText)
    return item => !!cleanedInput.length && this.matches(item, cleanedInput)
  }

  // TODO: make this smarter
  matches (item, cleanedInput) {
    const cleanedItem = this.clean(item)
    return cleanedItem.startsWith(cleanedInput) ||
      cleanedItem
        .split(' ')
        .map(substr => this.clean(substr).startsWith(cleanedInput))
        .reduce((anyMatch, currentMatch) => anyMatch || currentMatch, false)
  }

  clean (str) {
    return str
      .trim()
      .toLowerCase()
  }
}
