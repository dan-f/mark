import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import ErrorContainer from './Error'

import BookmarksPage from '../components/BookmarksPage'
import WelcomePage from '../components/WelcomePage'
import Nav from '../twinql-containers/Nav'

export default function App () {
  return (
    <Router>
      <div>
        <div className='row'>
          <div className='col'>
            <Nav webId='https://dan-f.databox.me/profile/card#me' />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <ErrorContainer />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <Switch>
              <Route exact path='/' component={WelcomePage} />
              <ProtectedRoute exact path='/m/:bookmarksContainer(.+)/' component={BookmarksPage} />
            </Switch>
          </div>
        </div>
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
