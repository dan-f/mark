import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import configureStore from './configureStore'
import Root from './components/Root'

const store = configureStore()

const render = RootComponent =>
  ReactDOM.render(
    <AppContainer>
      <RootComponent store={store} />
    </AppContainer>,
    document.getElementById('app-container')
  )

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    render(require('./components/Root').default)
  })
}

render(Root)
