import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AuthActions from 'redux-solid-auth/lib/actions'

class Auth extends React.Component {
  componentDidMount () {
    const { Actions } = this.props
    const { router } = this.context
    Actions.authenticate()
      .then(axn => {
        if (axn.type === 'AUTH_SUCCESS') {
          console.log('authenticated! webid:', axn.webId)
          // TODO: more robust way to discover bookmarks resource
          router.push(`/bookmarks/${encodeURIComponent(axn.webId.replace('card#me', 'bookmarks.ttl'))}`)
        } else {
          console.log('something bad happened:', axn.error)
        }
      })
  }

  render () {
    return <div>Logging in...</div>
  }
}

function mapDispatchToProps (dispatch) {
  return {
    Actions: bindActionCreators(AuthActions, dispatch)
  }
}
Auth.contextTypes = {
  router: PropTypes.object
}

export default connect(null, mapDispatchToProps)(Auth)
