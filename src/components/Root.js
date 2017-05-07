import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import LoginContainer from '../containers/LoginContainer'
import BookmarksListManager from '../containers/BookmarksListManager'

const Root = ({ store }) =>
  <Provider store={store}>
    <Router>
      <div>
        <Header />
        <Route exact path='/' component={LoginContainer} />
        <Route path='/m/:bookmarksContainer(.+)/' component={BookmarksListManager} />
        <Footer />
      </div>
    </Router>
  </Provider>

export default Root
