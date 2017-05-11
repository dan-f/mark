import React from 'react'
import { Signup } from 'solid-auth-tls'

import LinkButton from '../components/LinkButton'

export default class SignupButton extends React.Component {
  openSignupPopup () {
    const { onSignupSuccess } = this.props
    const signupUi = new Signup()
    signupUi.signup()
      .then(onSignupSuccess)
  }

  render () {
    const { props } = this
    return <LinkButton message='Sign Up' onClick={this.openSignupPopup.bind(this)} {...props} />
  }
}
