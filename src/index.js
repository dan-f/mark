import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import App from './containers/App'
import { loadState, saveState } from './localStorage'
import rootReducer from './reducers'

const middlewares = [thunkMiddleware]
if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger')
  middlewares.push(createLogger())
}

const persistedState =loadState()
const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(...middlewares)
)

store.subscribe(() => {
  const { auth, endpoints } = store.getState()
  saveState({ auth, endpoints })
})

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
