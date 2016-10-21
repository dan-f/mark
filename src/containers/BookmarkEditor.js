import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { rdflib } from 'solid-client'
import { isUri } from 'valid-url'

import * as Actions from '../actions'
import BookmarkForm from '../components/BookmarkForm'
import { bookmarkModelFactory } from '../models'

export class BookmarkEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getCleanState()
    this.handleFormFieldChange = this.handleFormFieldChange.bind(this)
    this.processTagsInput = this.processTagsInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  get defaultFormData () {
    return {
      url: '',
      title: '',
      description: '',
      tags: [],
      archived: false
    }
  }

  getCleanState () {
    return {
      formData: this.defaultFormData,
      rawTagsInput: '',
      isValid: false
    }
  }

  makeNewBookmark (url) {
    return bookmarkModelFactory(this.props.webId)(rdflib.graph(), url)
  }

  isFormDataValid (formData) {
    return isUri(formData.url)
      && formData.title.length > 0
  }

  handleFormFieldChange (fieldName, processTargetVal = val => val) {
    return (event) => {
      const formData = {
        ...this.state.formData,
        [fieldName]: processTargetVal(event.target.value)
      }
      this.setState({
        isValid: this.isFormDataValid(formData),
        formData
      })
    }
  }

  processTagsInput (rawTagsInput) {
    // rawTagsInput is a list of comma separated tags
    this.state.rawTagsInput = rawTagsInput
    return rawTagsInput
      .split(',')
      .filter(tag => tag.length > 0)
      .map(tag => tag.trim())
  }

  handleSubmit (event) {
    event.preventDefault()
    if (!this.state.isValid) {
      return
    }
    const {saveBookmark} = this.props.actions
    const bookmarkModel = this.state.formData.tags.reduce(
        (bookmarkModel, tag) => bookmarkModel.add('tags', tag, {listed: true}),
        this.makeNewBookmark(this.state.formData.url)
      )
      .add('url', this.state.formData.url, {listed: true})
      .add('title', this.state.formData.title, {listed: true})
      .add('description', this.state.formData.description, {listed: true})
      .add('archived', this.state.formData.archived, {listed: true})
    saveBookmark(bookmarkModel)
      .then(this.setState(this.getCleanState()))
  }

  handleCancel (event) {
    this.setState(this.getCleanState())
  }

  render () {
    const props = {
      title: this.state.formData.title,
      url: this.state.formData.url,
      tags: this.state.rawTagsInput,
      description: this.state.formData.description,
      isValid: this.state.isValid,
      handleChangeTitle: this.handleFormFieldChange('title'),
      handleChangeUrl: this.handleFormFieldChange('url'),
      handleChangeTags: this.handleFormFieldChange('tags', this.processTagsInput),
      handleChangeDescription: this.handleFormFieldChange('description'),
      handleSubmit: this.handleSubmit,
      handleCancel: this.handleCancel,
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
