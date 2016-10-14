import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AuthActions from 'redux-solid-auth/lib/actions'
import { getProfile } from 'solid-client'

import * as BookmarkActions from '../actions'

class Auth extends React.Component {
  componentDidMount () {
    const { Actions } = this.props
    const { router } = this.context
    Actions.authenticate()
      .then(axn => {
        // TODO: clean up this promise in the redux-solid-auth lib
        if (axn.type === 'AUTH_SUCCESS') {
          return getProfile(axn.webId)
        } else {
          throw new Error(axn.error)
        }
      })
      .then(solidProfile => solidProfile.loadTypeRegistry())
      .then(solidProfile => Actions.maybeInstallAppResources(solidProfile))
      .then(bookmarksUrl => router.push(`/bookmarks/${encodeURIComponent(bookmarksUrl)}`))
      // TODO: render an error page
      .catch(error => console.log(error))
  }

  render () {
    return <div>Logging in...</div>
  }
}

function mapDispatchToProps (dispatch) {
  return {
    Actions: {
      ...bindActionCreators(AuthActions, dispatch),
      ...bindActionCreators(BookmarkActions, dispatch)
    }
  }
}
Auth.contextTypes = {
  router: PropTypes.object
}

export default connect(null, mapDispatchToProps)(Auth)
