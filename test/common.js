import chai from 'chai'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import sinonChai from 'sinon-chai'
import { rdflib, web } from 'solid-client'
import SolidProfile from 'solid-client/lib/solid/profile'

chai.use(sinonChai)
export const { expect } = chai

export function mockStoreFactory (initialState = {}) {
  return configureMockStore([ thunkMiddleware ])(initialState)
}

export function solidProfileFactory () {
  const profileTTL = `
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .

  <> a <foaf:PersonalProfileDocument> ;
    foaf:maker <#me> ;
    foaf:primaryTopic <#me> .

  <#me> a <http://xmlns.com/foaf/0.1/Person> ;
    <http://www.w3.org/ns/pim/space#preferencesFile> <https://example.com/Preferences/prefs.ttl> ;
    <http://www.w3.org/ns/solid/terms#publicTypeIndex> <https://example.com/profile/publicTypeIndex.ttl> ;
    <http://xmlns.com/foaf/0.1/name> "Foo Bar" .
  `
  const profileGraph = rdflib.graph()
  rdflib.parse(profileTTL, profileGraph, 'https://example.com/profile/card', 'text/turtle')
  const solidProfile = new SolidProfile(
    'https://example.com/profile/card',
    profileGraph,
    rdflib,
    web
  )
  solidProfile.isLoaded = true
  return solidProfile
}
