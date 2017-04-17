import { connect } from '../lib/react-twinql'

import Nav from '../components/Nav'

export default connect({
  query: props => `
    @prefix foaf http://xmlns.com/foaf/0.1/
    ${props.webId} {
      foaf:img
    }
  `,

  mapResponseToProps: response =>
    response || { 'foaf:img': '/solid-logo.svg' }
})(Nav)
