import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { loadState, saveState } from './localStorage'
import rootReducer from './reducers'

const configureStore = () => {
  const persistedState = loadState()

  const middlewares = [thunkMiddleware]
  if (process.env.NODE_ENV === 'development') {
    const createLogger = require('redux-logger')
    middlewares.push(createLogger())
  }

  const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(...middlewares)
  )

  store.subscribe(() => {
    const { auth, endpoints } = store.getState()
    saveState({ auth, endpoints })
  })

  return store
}

export default configureStore
