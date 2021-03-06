import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import Alert from '../components/Alert'

const ERROR_ALERT_TYPE = 'danger'

export const Error = ({ heading, message, actions: { clearError } }) =>
  <Alert type={ERROR_ALERT_TYPE} {...{ heading, message }} onDismiss={clearError} />

const mapStateToProps = state => ({
  ...state.alerts.get(ERROR_ALERT_TYPE)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Error)
