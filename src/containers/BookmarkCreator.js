import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'
import { rdflib } from 'solid-client'

import * as Actions from '../actions'
import BookmarkEditor from './BookmarkEditor'
import { bookmarkModelFactory } from '../models'

export class BookmarkCreator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newBookmarkModel: null
    }
    this.handleClickNewBookmark = this.handleClickNewBookmark.bind(this)
    this.reset = this.reset.bind(this)
  }

  makeNewBookmark () {
    return bookmarkModelFactory(this.props.webId)(rdflib.graph(), `#${uuid.v4()}`)
  }

  handleClickNewBookmark () {
    this.setState({newBookmarkModel: this.makeNewBookmark()})
  }

  reset (event) {
    this.setState({newBookmarkModel: null})
  }

  render () {
    return this.state.newBookmarkModel
      ? <BookmarkEditor model={this.state.newBookmarkModel} handleCancel={this.reset} afterSubmit={this.reset} />
      : (
        <div className='row'>
          <div className='col-xs-12'>
            <button type='button' className='btn' onClick={this.handleClickNewBookmark}>New bookmark</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkCreator)
