if (process.env.NODE_ENV === 'test') {
  const { MockLocalStorage } = require('../test/common')
  global.localStorage = new MockLocalStorage()
}

export const loadState = () => {
  // Note we return undefined for error cases so that the reducers can
  // initialize the app state
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) { // 'state' key not in the store
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    console.warn('Error saving state:', state)
  }
}
