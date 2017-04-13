import Immutable from 'immutable'
import md5 from 'md5'
import PropTypes from 'prop-types'
import { createElement, Children, Component } from 'react'

export function connect ({ query, mapResponseToProps, mapErrorToProps }) {
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
        queryManager.request(queryString, this.onResponse.bind(this), this.onError.bind(this))
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

  request (query, onData, onError) {
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

export function findOne (...args) {
  const found = find(...args)
  return found && found.length > 0
    ? found[0]
    : null
}

export function find (...args) {
  let response = args[0]
  const edges = args.slice(1)
  for (let edge of edges) {
    if (!response) { break }
    response = response[edge]
  }
  return response || null
}
