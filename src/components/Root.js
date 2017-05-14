import React from 'react'
import Loadable from 'react-loading-overlay'
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

const BookmarksListList = ({ myWebId, lists, loading }) =>
  <Loadable active={loading} text='Loading...' background='#FFF' color='#000'>
    <ListGroup>
      {lists.map(({ webId, name, img, listUrl }) =>
        <ListGroupItem key={webId}>
          <div>
            <a href={`https://databox.me/apps/friends/?view=${encodeURIComponent(webId)}`} target='_blank'>
              <img className='img rounded mr-3' src={img} width='45' height='45' alt="User's profile image" />
            </a>
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
  </Loadable>

class BookmarksListListContainer extends React.Component {
  state = {
    loading: false
  }

  startLoading = () =>
    this.setState({ loading: true })

  doneLoading = () =>
    this.setState({ loading: false })

  componentDidMount () {
    this.startLoading()
    this.props.actions.findLists()
      .then(this.doneLoading)
      .then(this.doneLoading)
  }

  render () {
    const { lists, webId } = this.props
    const { loading } = this.state

    return <BookmarksListList myWebId={webId} lists={lists} loading={loading} />
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
