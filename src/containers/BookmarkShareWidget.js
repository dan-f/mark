import React from 'react'
import ReactTransitionGroup from 'react-addons-transition-group'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import ListGroup from '../components/ListGroup'
import ListItem from '../components/ListItem'
import Modal from '../components/Modal'

class Authorization extends React.Component {
  constructor (props) {
    super(props)
    this.state = { authorization: props.authorization }
    this.handleClickAccess = this.handleClickAccess.bind(this)
  }

  handleClickAccess (mode) {
    return event => {
      const { authorization } = this.state
      const matchingModes = authorization.fields('mode').filter(m => m.value === mode)
      let newAuthorization
      if (event.currentTarget.checked) {
        newAuthorization = matchingModes.length
          ? authorization
          : authorization.add('mode', mode, {namedNode: true})
      } else {
        newAuthorization = matchingModes.reduce((auth, field) => {
          return auth.remove(field)
        }, authorization)
      }
      this.setState({
        authorization: newAuthorization
      })
    }
  }

  render () {
    const { authorization } = this.state
    const { currentUserWebId } = this.props
    // for now assume one agent per authorization
    const modes = authorization.get('mode')
    const getMode = mode => modes.find(m => m === mode)
    const read = 'http://www.w3.org/ns/auth/acl#Read'
    const write = 'http://www.w3.org/ns/auth/acl#Write'
    const control = 'http://www.w3.org/ns/auth/acl#Control'
    const readMode = getMode(read)
    const writeMode = getMode(write)
    const controlMode = getMode(control)
    const canRead = typeof readMode !== 'undefined'
    const canWrite = typeof writeMode !== 'undefined'
    const canControl = typeof controlMode !== 'undefined'
    const agent = authorization.any('agent')
    const isYou = agent === currentUserWebId
    return (
      <div className='d-flex w-100 justify-content-between'>
        <div>{agent} <span>{isYou ? '(you)' : ''}</span></div>
        <form className='form-inline d-inline-flex align-items-center'>
          <div className='form-check'>
            <label className='custom-control custom-checkbox'>
              <input className='custom-control-input' type='checkbox' checked={canRead} onChange={this.handleClickAccess(read)} />
              <span className='custom-control-indicator' />
              <span className='custom-control-description'>read</span>
            </label>
          </div>
          <div className='form-check'>
            <label className='custom-control custom-checkbox'>
              <input className='custom-control-input' type='checkbox' checked={canWrite} onChange={this.handleClickAccess(write)} />
              <span className='custom-control-indicator' />
              <span className='custom-control-description'>write</span>
            </label>
          </div>
          <div className='form-check'>
            <label className='custom-control custom-checkbox'>
              <input className='custom-control-input' type='checkbox' checked={canControl} onChange={this.handleClickAccess(control)} />
              <span className='custom-control-indicator' />
              <span className='custom-control-description'>control</span>
            </label>
          </div>
        </form>
      </div>
    )
  }
}

export class BookmarkShareWidget extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickCancel = this.handleClickCancel.bind(this)
    this.handleClickSave = this.handleClickSave.bind(this)
    this.state = {
      editingPermissions: false,
      authorizations: null,
      bookmark: null
    }
  }

  render () {
    const { webId } = this.props
    const { editingPermissions, authorizations, bookmark } = this.state

    return (
      <ReactTransitionGroup component='div'>
        {editingPermissions
          ? <Modal title={`Share "${bookmark.any('title')}"`} onClickCancel={this.handleClickCancel(bookmark)} onClickSave={this.handleClickSave(bookmark)}>
            <ListGroup>
              {authorizations.map(authorization =>
                <ListItem key={authorization.subject.value}>
                  <Authorization authorization={authorization} currentUserWebId={webId} />
                </ListItem>
              )}
            </ListGroup>
          </Modal>
          : null
        }
      </ReactTransitionGroup>
    )
  }

  handleClickCancel (bookmark) {
    return () => {
      return this.props.actions.cancelEditingPermissions(bookmark)
    }
  }

  handleClickSave (bookmark) {
    return () => {
      return this.props.actions.savePermissions(bookmark)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { bookmark } = nextProps
    const editingPermissions = typeof bookmark !== 'undefined'
    this.setState({
      editingPermissions,
      bookmark: editingPermissions ? bookmark.get('model') : null,
      authorizations: editingPermissions ? bookmark.get('authorizations') : null
    })
  }
}

function mapStateToProps (state) {
  return {
    bookmark: state.bookmarks.find(bookmark => bookmark.get('isEditingPermissions')),
    webId: state.auth.webId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkShareWidget)
