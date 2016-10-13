import React from 'react'
import { Router, Route, hashHistory } from 'react-router'

import Auth from '../containers/Auth'
import BookmarksLoader from '../containers/BookmarksLoader'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path='/' component={Auth} />
          <Route path='/bookmarks/:bookmarksUrl' component={BookmarksLoader} />
        </Router>
      </div>
    )
  }
}
