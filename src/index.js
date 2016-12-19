import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { authenticate } from 'redux-solid-auth/lib/actions'
import thunkMiddleware from 'redux-thunk'
import { getProfile } from 'solid-client'

import { maybeInstallAppResources } from './actions'
import App from './containers/App'
import rootReducer from './reducers'

const middlewares = [thunkMiddleware]
if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger')
  middlewares.push(createLogger())
}
const store = createStore(rootReducer, applyMiddleware(...middlewares))

store.dispatch(authenticate())
  .then(webId => getProfile(webId))
  .then(solidProfile => solidProfile.loadTypeRegistry())
  .then(solidProfile => store.dispatch(maybeInstallAppResources(solidProfile)))
  .catch(error => console.log(error))

function render (AppComponent) {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <AppComponent />
      </AppContainer>
    </Provider>,
    document.getElementById('app-container')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render(require('./containers/App').default)
  })
}
