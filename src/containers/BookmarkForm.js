import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { rdflib } from 'solid-client'
import { isUri } from 'valid-url'

import * as Actions from '../actions'
import { bookmarkModelFactory } from '../models'

export class BookmarkForm extends React.Component {
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
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <span>Add a bookmark</span>
          <form onSubmit={this.handleSubmit}>
            <div className='form-group row'>
              <label htmlFor='title-input' className='col-xs-3 col-sm-2 col-form-label'>Title:</label>
              <div className='col-xs-10'>
                <input type='text' className='form-control' id='title-input' value={this.state.formData.title} onChange={this.handleFormFieldChange('title')} />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='url-input' className='col-xs-3 col-sm-2 col-form-label'>URL:</label>
              <div className='col-xs-10'>
                <input type='url' className='form-control' id='url-input' value={this.state.formData.url} onChange={this.handleFormFieldChange('url')} />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='tag-input' className='col-xs-3 col-sm-2 col-form-label'>Tags:</label>
              <div className='col-xs-10'>
                <input type='text' className='form-control' id='tag-input' value={this.state.rawTagsInput} onChange={this.handleFormFieldChange('tags', this.processTagsInput)} />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='description-textarea' className='col-xs-3 col-sm-2 col-form-label'>Description:</label>
              <div className='col-xs-10'>
                <textarea className='form-control' rows='3' id='description-textarea' value={this.state.formData.description} onChange={this.handleFormFieldChange('description')} />
              </div>
            </div>
            <div className='form-group row'>
              <div className='col-xs-6 col-sm-3'>
                <button type='submit' className='btn btn-primary' disabled={!this.state.isValid} >Add Bookmark</button>
              </div>
              <div className='col-xs-6 col-sm-3'>
                <button type='reset' className='btn btn-secondary' onClick={this.handleCancel}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkForm)
