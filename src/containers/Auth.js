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
      .then(webId => getProfile(webId))
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
