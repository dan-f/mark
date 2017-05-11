import queryString from 'query-string'
import React from 'react'
import Loadable from 'react-loading-overlay'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

import LoginPage from '../components/LoginPage'

export class LoginContainer extends React.Component {
  state = {
    loggingIn: false,
    loginUiOpen: false,
    loginServer: this.props.auth.lastIdp
  }

  onClickLogin = () => {
    this.setState({ loginUiOpen: true })
  }

  onClickCancel = () => {
    this.setState({ loginUiOpen: false, loginServer: this.props.auth.lastIdp })
  }

  onChangeLoginServer = event => {
    this.setState({ loginServer: event.target.value })
  }

  onSubmitLogin = event => {
    event.preventDefault()
    this.redirectToIdpLogin()
  }

  redirectToIdpLogin = webId => {
    const { findEndpoints, saveLastIdp } = this.props.actions
    let loginServer = webId || this.state.loginServer.trim()
    if (!loginServer) {
      return
    }
    if (!/^http(s)?:\/\//.test(loginServer)) {
      loginServer = `https://${loginServer}`
    }
    findEndpoints(loginServer)
      .then(action => {
        saveLastIdp(loginServer)
        window.location.assign(
          `${action.endpoints.login}?redirect=${window.location.href}&origin=${window.location.origin}`
        )
      })
  }

  componentDidMount () {
    const { auth, history, location } = this.props
    const { loadProfile, maybeInstallAppResources, saveCredentials } = this.props.actions
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
    this.setState({ loggingIn: true })
    loadProfile()
      .then(maybeInstallAppResources)
      .then(bookmarksContainer => {
        this.setState({ loggingIn: false })
        history.push(`/m/${bookmarksContainer}`)
      })
      .catch(() => this.setState({ loggingIn: false }))
  }

  render () {
    const { loginUiOpen, loggingIn, loginServer } = this.state
    const { onClickLogin, onChangeLoginServer, onClickCancel, onSubmitLogin, redirectToIdpLogin } = this
    const props = {
      loginUiOpen,
      loginServer,
      onClickLogin,
      onChangeLoginServer,
      onClickCancel,
      onSubmitLogin,
      redirectToIdpLogin
    }
    return (
      <Loadable active={loggingIn} spinner background='#FFFFFF' color='#000'>
        <LoginPage {...props} />
      </Loadable>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
