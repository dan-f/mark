import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(chaiImmutable)
chai.use(sinonChai)
export const { expect } = chai

export function mockStoreFactory (initialState = {}) {
  return configureMockStore([ thunkMiddleware ])(initialState)
}

export class MockLocalStorage {
  constructor () {
    this.store = {}

    this.getItem = sinon.spy(this, 'getItem')
    this.setItem = sinon.spy(this, 'setItem')
  }

  getItem (key) {
    return this.store[key] || null
  }

  setItem (key, val) {
    this.store[key] = typeof val === 'string'
      ? val
      : JSON.stringify(val)
  }
}

export const profileTurtle = `
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<> a <foaf:PersonalProfileDocument> ;
  foaf:maker <#me> ;
  foaf:primaryTopic <#me> .

<#me> a <http://xmlns.com/foaf/0.1/Person> ;
  <http://www.w3.org/ns/pim/space#preferencesFile> <https://localhost:8443/Preferences/prefs.ttl> ;
  <http://www.w3.org/ns/pim/space#storage> <https://localhost:8443/> ;
  <http://www.w3.org/ns/solid/terms#publicTypeIndex> <https://localhost:8443/profile/publicTypeIndex.ttl> ;
  <http://xmlns.com/foaf/0.1/name> "Foo Bar" .
`
