import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Signup } from 'solid-auth-tls'

import * as Actions from '../actions'

import LinkButton from '../components/LinkButton'

export class SignupButton extends React.Component {
  openSignupPopup () {
    const { saveWebId, login } = this.props.actions
    const signupUi = new Signup()
    signupUi.signup()
      .then(saveWebId)
      .then(login)
  }

  render () {
    const { props } = this
    return <LinkButton message='Sign Up' onClick={this.openSignupPopup.bind(this)} {...props} />
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(null, mapDispatchToProps)(SignupButton)
