import defaults from 'lodash/defaults'
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

  get initialFormData () {
    return defaults(
      {
        url: this.props.model.any('url'),
        title: this.props.model.any('title'),
        description: this.props.model.any('description'),
        tags: this.props.model.get('tags'),
        archived: this.props.model.any('archived')
      },
      this.defaultFormData
    )
  }

  getCleanState () {
    return {
      formData: this.initialFormData,
      rawTagsInput: this.props.model.get('tags').join(', '),
      isValid: false
    }
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
    this.setState({
      ...this.state,
      rawTagsInput
    })
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

    const {model} = this.props
    const {saveBookmark} = this.props.actions

    // I don't like how imperative this code is.  It would be really nice to
    // describe these operations as a query.
    const tagFieldsToRemove = model.fields('tags')
      .filter(tagField => !this.state.formData.tags.includes(tagField.value))
    const tagsToAdd = this.state.formData.tags
      .filter(tag => !model.get('tags').includes(tag))

    const isPublic = {listed: true}
    let bookmarkModel = model
      .setAny('url', this.state.formData.url, isPublic)
      .setAny('title', this.state.formData.title, isPublic)
      .setAny('description', this.state.formData.description, isPublic)
      .setAny('archived', this.state.formData.archived, isPublic)
    bookmarkModel = tagsToAdd.reduce(
      (model, tag) => bookmarkModel.add('tags', tag, isPublic),
      bookmarkModel
    )
    bookmarkModel = tagFieldsToRemove.reduce(
      (model, tagField) => bookmarkModel.remove(tagField),
      bookmarkModel
    )

    saveBookmark(bookmarkModel)
      .then(this.setState(this.getCleanState()))
      .catch(err => {
        debugger
        console.log(err)
      })
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
      handleCancel: this.props.handleCancel,
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
