import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './App'

const bookmarks = [
  {
    title: 'JSON-LD',
    url: 'http://json-ld.org/',
    tags: ['JSON-LD', 'Linked Data'],
    comments: 'JSON-LD home page',
    archived: false
  },
  {
    title: 'JSON-LD Framing',
    url: 'http://json-ld.org/spec/latest/json-ld-framing/',
    tags: ['JSON-LD', 'Linked Data', 'spec'],
    comments: 'JSON-LD framing spec',
    archived: true
  }
]

function render (AppComponent) {
  ReactDOM.render(
    <AppContainer>
      <AppComponent bookmarks={bookmarks} />
    </AppContainer>,
    document.getElementById('app-container')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    render(require('./App').default)
  })
}
