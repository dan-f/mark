import React from 'react'
import { connect } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'

import BookmarksWelcome from './BookmarksWelcome'
import BookmarksLoader from './BookmarksLoader'

export function App ({ webId }) {
  return (
    webId
      ? <div>
        <Router history={hashHistory}>
          <Route path='/' component={BookmarksWelcome} />
          <Route path='/bookmarks/:bookmarksUrl' component={BookmarksLoader} />
        </Router>
      </div>
      : <div>
        Logging in...
      </div>
  )
}

function mapStateToProps (state) {
  return {
    webId: state.auth.webId
  }
}

export default connect(mapStateToProps)(App)
