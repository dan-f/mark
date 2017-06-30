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
    loginServer: this.props.lastIdp
  }

  onClickLogin = () =>
    this.setState({ loginUiOpen: true })

  onClickCancel = () =>
    this.setState({ loginUiOpen: false, loginServer: this.props.lastIdp })

  onChangeLoginServer = event =>
    this.setState({ loginServer: event.target.value })

  onSubmitLogin = event => {
    event.preventDefault()
    this.loginAndShowBookmarks()
  }

  loginAndShowBookmarks = () =>
    this.props.actions.login(this.state.loginServer)
      .then(this.showBookmarks)

  showBookmarks = () => {
    const { history } = this.props
    const { currentSession, loadProfile, maybeInstallAppResources } = this.props.actions
    this.setState({ loggingIn: true })
    return currentSession()
      .then(loadProfile)
      .then(maybeInstallAppResources)
      .then(bookmarksContainer => {
        this.setState({ loggingIn: false })
        history.push(`/m/${bookmarksContainer}`)
      })
      .catch(() => this.setState({ loggingIn: false }))
  }

  componentDidMount () {
    this.showBookmarks()
  }

  render () {
    const { loginUiOpen, loggingIn, loginServer } = this.state
    const { loginAndShowBookmarks, onClickLogin, onChangeLoginServer, onClickCancel, onSubmitLogin } = this
    const props = {
      loginUiOpen,
      loginServer,
      onClickLogin,
      onChangeLoginServer,
      onClickCancel,
      onSubmitLogin,
      loginAndShowBookmarks
    }
    return (
      <Loadable active={loggingIn} spinner background='#FFFFFF' color='#000'>
        <LoginPage {...props} />
      </Loadable>
    )
  }
}

const mapStateToProps = state => ({
  lastIdp: state.auth.lastIdp
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
