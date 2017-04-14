import Immutable from 'immutable'
import md5 from 'md5'
import PropTypes from 'prop-types'
import { createElement, Children, Component } from 'react'

const defaultMapResponseToProps = response => response

const defaultMapErrorToProps = error => ({ '@error': error })

export function connect ({ query, mapResponseToProps = defaultMapResponseToProps, mapErrorToProps = defaultMapErrorToProps }) {
  return function wrapWithConnect (WrappedComponent) {
    class ConnectedComponent extends Component {
      constructor (props, context) {
        super(props, context)
        this.state = {
          propsForWrapped: mapResponseToProps(null, this.props)
        }
      }

      componentDidMount () {
        const { queryManager } = this.context
        const queryString = query(this.props)
        this.unsubscribe = queryManager.subscribe(queryString, this.onResponse.bind(this), this.onError.bind(this))
      }

      componentWillUnmount () {
        this.unsubscribe()
      }

      onResponse (response) {
        const propsForWrapped = this.mergeProps(mapResponseToProps(response, this.props))
        this.setState({ propsForWrapped })
      }

      onError (error) {
        const propsForWrapped = this.mergeProps(mapErrorToProps(error, this.props))
        this.setState({ propsForWrapped })
      }

      mergeProps (propsForWrapped) {
        return { ...this.props, ...propsForWrapped }
      }

      render () {
        const { propsForWrapped } = this.state
        return createElement(WrappedComponent, propsForWrapped)
      }
    }

    ConnectedComponent.contextTypes = {
      queryManager: PropTypes.object.isRequired
    }

    return ConnectedComponent
  }
}

export class Provider extends Component {
  constructor (props, context) {
    super(props, context)
    this.queryManager = new QueryManager(this.props.endpoint)
  }

  getChildContext () {
    const { queryManager } = this
    return { queryManager }
  }

  render () {
    return Children.only(this.props.children)
  }
}

Provider.propTypes = {
  children: PropTypes.element.isRequired
}

Provider.childContextTypes = {
  queryManager: PropTypes.object.isRequired
}

/*

  A subscription based store.  Clients register twinql queries with callbacks.

*/
class QueryManager {
  constructor (endpoint) {
    this.endpoint = endpoint
    this.queryMap = Immutable.Map()
  }

  subscribe (query, onData, onError) {
    // Update the query map with the callbacks
    const key = this.queryKey(query)
    this.queryMap = this.queryMap.update(key, entry => {
      if (!entry) {
        return QueryMapEntry({
          query,
          onDataCallbacks: Immutable.Set([onData]),
          onErrorCallbacks: Immutable.Set([onError])
        })
      }
      return entry
        .update('onDataCallbacks', callbacks => callbacks.add(onData))
        .update('onErrorCallbacks', callbacks => callbacks.add(onError))
    })
    // Run the query and update clients
    // First, call the callbacks with the "optimistic" response, then call them with the current response.
    const onDataCallbacks = this.queryMap.get(key).get('onDataCallbacks')
    onDataCallbacks.map(cb => cb(this.queryMap.get(key).get('response')))
    this.query(query)
      .then(response => {
        this.queryMap = this.queryMap.update(key, entry => entry.set('response', response))
        onDataCallbacks.map(cb => cb(response))
      })
      .catch(error => {
        this.queryMap.get(key).get('onErrorCallbacks').map(cb => cb(error))
      })
    // Return a function for unsubscribing
    return () => {
      this.queryMap = this.queryMap
        .updateIn([key, 'onDataCallbacks'], callbacks => callbacks.remove(onData))
        .updateIn([key, 'onErrorCallbacks'], callbacks => callbacks.remove(onError))
    }
  }

  queryKey (query) {
    return md5(query)
  }

  query (q) {
    return fetch(global.QUERY_ENDPOINT, {
      method: 'POST',
      body: q
    }).then(response => response.json())
  }
}

const QueryMapEntry = Immutable.Record({
  query: '',
  response: null,
  onDataCallbacks: Immutable.Set(),
  onErrorCallbacks: Immutable.Set()
})
