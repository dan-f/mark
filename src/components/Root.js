import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Nav from './Nav'
import Footer from './Footer'
import Error from '../containers/Error'
import Info from '../containers/Info'
import LoginContainer from '../containers/LoginContainer'
import BookmarksListManager from '../containers/BookmarksListManager'

const Root = ({ store }) =>
  <Provider store={store}>
    <Router>
      <div className='row'>
        <div className='col-md-9'>
          <Nav />
          <Error />
          <Info />
          <Route exact path='/' component={LoginContainer} />
          <Route path='/m/:bookmarksContainer(.+)/' component={BookmarksListManager} />
          <Footer />
        </div>
      </div>
    </Router>
  </Provider>

export default Root
