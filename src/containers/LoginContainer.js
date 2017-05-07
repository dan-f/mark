import queryString from 'query-string'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

import LoginPage from '../components/LoginPage'

export class LoginContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loggingIn: false, loginServer: '' }
    this.handleClickLogin = this.handleClickLogin.bind(this)
    this.handleChangeLoginServer = this.handleChangeLoginServer.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.maybeRedirectToApp()
  }

  maybeRedirectToApp () {
    const { auth, history, location } = this.props
    const { maybeInstallAppResources, saveCredentials } = this.props.actions
    let { webid: webId, key } = queryString.parse(location.search)
    if (!(webId && key)) {
      webId = auth.webId
      key = auth.key
    }
    if (webId && key) {
      saveCredentials({ webId, key })
    } else {
      return
    }
    maybeInstallAppResources()
      .then(bookmarksContainer => {
        history.push(`/m/${bookmarksContainer}`)
      })
  }

  handleClickLogin () {
    this.setState({ loggingIn: true })
  }

  handleChangeLoginServer (event) {
    this.setState({ loginServer: event.target.value })
  }

  handleCancel () {
    this.setState({ loggingIn: false, loginServer: '' })
  }

  handleSubmit (event) {
    event.preventDefault()
    const { findEndpoints } = this.props.actions
    let { loginServer } = this.state
    loginServer = loginServer.trim()
    if (!loginServer) {
      return
    }
    if (!/^http(s)?:\/\//.test(loginServer)) {
      loginServer = `https://${loginServer}`
    }
    findEndpoints(loginServer)
      .then(action =>
        window.location.assign(
          `${action.endpoints.login}?redirect=${document.location.href}&origin=${document.origin}`
        )
      )
  }

  render () {
    const { loggingIn } = this.state
    const { handleClickLogin, handleChangeLoginServer, handleCancel, handleSubmit } = this
    const props = { loggingIn, handleClickLogin, handleChangeLoginServer, handleCancel, handleSubmit }
    return <LoginPage {...props} />
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
