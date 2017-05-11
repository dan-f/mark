import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Nav from './Nav'
import Footer from './Footer'
import Error from '../containers/Error'
import Info from '../containers/Info'
import LoginContainer from '../containers/LoginContainer'
import BookmarksListManager from '../containers/BookmarksListManager'



import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ListGroup from './ListGroup'
import ListGroupItem from './ListGroupItem'

import * as Actions from '../actions'

const BookmarksListList = ({ myWebId, lists }) =>
  <ListGroup>
    {lists.map(({ webId, name, img, listUrl }) =>
      <ListGroupItem key={webId}>
        <div>
          <img className='img rounded mr-3' src={img} width='45' height='45' alt="User's profile image" />
          <Link to={`/m/${listUrl}`}>
            {webId === myWebId
              ? 'My Bookmarks'
              : `${name}'s Bookmarks`
            }
          </Link>
        </div>
      </ListGroupItem>
    )}
  </ListGroup>

class BookmarksListListContainer extends React.Component {
  componentDidMount () {
    this.props.actions.findLists()
  }

  render () {
    const { lists, webId } = this.props
    return <BookmarksListList myWebId={webId} lists={lists} />
  }
}

const mapStateToProps = state => ({
  webId: state.auth.webId,
  lists: state.lists
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

BookmarksListListContainer = connect(mapStateToProps, mapDispatchToProps)(BookmarksListListContainer)


const Root = ({ store }) =>
  <Provider store={store}>
    <Router>
      <div className='row'>
        <div className='col-md-9'>
          <Nav />
          <Error />
          <Info />
          <Route exact path='/' component={LoginContainer} />
          <Route exact path='/m/' component={BookmarksListListContainer} />
          <Route path='/m/:bookmarksContainer(.+)/' component={BookmarksListManager} />
          <Footer />
        </div>
      </div>
    </Router>
  </Provider>

export default Root
