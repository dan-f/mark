import Immutable from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isUri } from 'valid-url'

import * as Actions from '../actions'
import BookmarkForm from '../components/BookmarkForm'

export class BookmarkEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getCleanState()
    this.handleFormFieldChange = this.handleFormFieldChange.bind(this)
    this.processTagsInput = this.processTagsInput.bind(this)
    this.processArchivedInput = this.processArchivedInput.bind(this)
    this.processUriInput = this.processUriInput.bind(this)
    this.processLiteralInput = this.processLiteralInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  get initialBookmark () {
    const { bookmark } = this.props
    return bookmark.get('data')
  }

  afterSubmit () {
    const hook = this.props.afterSubmit
    return hook ? hook() : null
  }

  getCleanState () {
    const { bookmark } = this.props
    return {
      bookmark: this.initialBookmark,
      rawTagsInput: bookmark.getIn(['data', 'book:hasTopic']).map(tag => tag.get('@value')).join(', '),
      isValid: false
    }
  }

  isBookmarkValid (bookmark) {
    return isUri(bookmark.getIn(['book:recalls', '@id'])) && bookmark.getIn(['dc:title', '@value']).length > 0 &&
      !this.props.bookmark.get('data').equals(bookmark)
  }

  handleFormFieldChange (fieldName, processEvent = this.processLiteralInput) {
    return (event) => {
      const bookmark = this.state.bookmark
        .merge({ [fieldName]: processEvent(event) })
      this.setState({
        isValid: this.isBookmarkValid(bookmark),
        bookmark
      })
    }
  }

  processTagsInput (event) {
    // rawTagsInput is a list of comma separated tags
    const rawTagsInput = event.target.value
    this.setState({ rawTagsInput })
    return Immutable.List(
      rawTagsInput
        .split(',')
        .filter(tag => tag.length > 0)
        .map(tag => Immutable.Map({ '@value': tag.trim() }))
      )
  }

  processArchivedInput (event) {
    return {
      '@value': JSON.stringify(event.target.checked),
      '@type': 'http://www.w3.org/2001/XMLSchema#boolean'
    }
  }

  processUriInput (event) {
    return { '@id': event.target.value }
  }

  processLiteralInput (event) {
    return { '@value': event.target.value }
  }

  handleSubmit (event) {
    event.preventDefault()
    if (!this.state.isValid) {
      return
    }

    const { bookmark } = this.props
    const { saveBookmark } = this.props.actions
    const original = bookmark.get('data')
    const updated = this.state.bookmark
    saveBookmark(original, updated, bookmark.get('isNew'))

    this.afterSubmit()
  }

  render () {
    const props = {
      title: this.state.bookmark.getIn(['dc:title', '@value']),
      url: this.state.bookmark.getIn(['book:recalls', '@id']),
      tags: this.state.rawTagsInput,
      description: this.state.bookmark.getIn(['dc:description', '@value']),
      archived: JSON.parse(this.state.bookmark.getIn(['solid:read', '@value'])),
      isValid: this.state.isValid,
      handleChangeTitle: this.handleFormFieldChange('dc:title'),
      handleChangeUrl: this.handleFormFieldChange('book:recalls', this.processUriInput),
      handleChangeTags: this.handleFormFieldChange('book:hasTopic', this.processTagsInput),
      handleChangeDescription: this.handleFormFieldChange('dc:description'),
      handleChangeArchived: this.handleFormFieldChange('solid:read', this.processArchivedInput),
      handleSubmit: this.handleSubmit,
      handleCancel: this.props.handleCancel
    }
    return (
      <BookmarkForm {...props} />
    )
  }
}

function mapStateToProps (state) {
  return {
    webId: state.auth.webId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkEditor)
