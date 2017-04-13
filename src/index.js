import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { checkProfile } from './actions'
import App from './containers/App'
import { Provider as TwinqlProvider } from './lib/react-twinql'
import rootReducer from './reducers'

const middlewares = [thunkMiddleware]
if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger')
  middlewares.push(createLogger())
}
const store = createStore(rootReducer, applyMiddleware(...middlewares))

store.dispatch(checkProfile())

function render (AppComponent) {
  ReactDOM.render(
    <Provider store={store}>
      <TwinqlProvider endpoint={global.QUERY_ENDPOINT}>
        <AppContainer>
          <AppComponent />
        </AppContainer>
      </TwinqlProvider>
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
