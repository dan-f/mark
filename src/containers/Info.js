import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'
import Alert from '../components/Alert'

const INFO_ALERT_TYPE = 'info'

export const Info = ({ heading, message, actions: { clearInfo } }) =>
  <Alert type={INFO_ALERT_TYPE} {...{ heading, message }} onDismiss={clearInfo} />

const mapStateToProps = state => ({
  ...state.alerts.get(INFO_ALERT_TYPE)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Info)
