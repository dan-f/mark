import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import LoginContainer from '../containers/LoginContainer'
import BookmarksLoader from '../containers/BookmarksLoader'
import DropContainer from '../containers/DropContainer'

const Root = ({ store }) =>
  <Provider store={store}>
    <Router>
      <DropContainer>
        <Header />
        <Route exact path='/' component={LoginContainer} />
        <Route path='/m/:bookmarksUrl(.+)/' component={BookmarksLoader} />
        <Footer />
      </DropContainer>
    </Router>
  </Provider>

export default Root
