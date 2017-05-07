import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import configureStore from './configureStore'
import App from './containers/App'

const store = configureStore()

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
