import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

import SignupButton from './SignupButton'

export class LoginSignup extends React.Component {
  constructor (props) {
    super(props)
    this.bootstrap = this.bootstrap.bind(this)
    this.redirectIfLoggedIn = this.redirectIfLoggedIn.bind(this)
    this.redirectIfLoggedIn()
  }

  render () {
    return (
      <div>
        <button type='button' className='btn btn-outline-primary' onClick={this.bootstrap}>Log In</button>
        <SignupButton />
      </div>
    )
  }

  componentDidUpdate () {
    this.redirectIfLoggedIn()
  }

  bootstrap () {
    const { login } = this.props.actions
    return login()
      .then(this.redirectIfLoggedIn)
  }

  redirectIfLoggedIn () {
    const { bookmarksUrl, history, location, loggedIn } = this.props
    const { maybeInstallAppResources } = this.props.actions
    if (!loggedIn) {
      return
    }
    maybeInstallAppResources()
      .then(() => {
        const redirectTo = location.state && location.state.from
          ? location.state.from.pathname
          : `/m/${bookmarksUrl}`
        history.push(redirectTo)
      })
  }
}

function mapStateToProps (state) {
  return {
    loggedIn: !!state.profile,
    bookmarksUrl: state.bookmarksUrl
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginSignup))
