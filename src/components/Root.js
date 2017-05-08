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
      <div className='row'>
        <div className='col-md-9'>
          <Header />
          <Route exact path='/' component={LoginContainer} />
          <Route path='/m/:bookmarksContainer(.+)/' component={BookmarksListManager} />
          <Footer />
        </div>
      </div>
    </Router>
  </Provider>

export default Root
