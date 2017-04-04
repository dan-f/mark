import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import WelcomePage from '../components/WelcomePage'
import Header from '../components/Header'
import BookmarksLoader from './BookmarksLoader'

export default function App () {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={WelcomePage} />
          <ProtectedRoute path='/m/:bookmarksUrl(.+)/' component={BookmarksLoader} />
        </Switch>
      </div>
    </Router>
  )
}

let ProtectedRoute = ({ component, loggedIn, ...rest }) => {
  const renderRoute = props => (
    loggedIn
      ? React.createElement(component, props)
      : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
  )
  return (
    <Route {...rest} render={renderRoute} />
  )
}

function mapStateToProps (state) {
  return {
    loggedIn: !!state.auth.webId
  }
}

ProtectedRoute = connect(mapStateToProps)(ProtectedRoute)
