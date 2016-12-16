import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

export function Error ({ error, actions }) {
  if (error.length) {
    return (
      <div className='alert alert-danger' role='alert'>
        <button type='button' className='close' aria-label='Close' onClick={actions.clearError}>
          <span aria-hidden='true'>&times;</span>
        </button>
        {error}
      </div>
    )
  } else {
    return <div />
  }
}

function mapStateToProps (state) {
  return {
    error: state.error
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Error)
