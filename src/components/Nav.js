import PropTypes from 'prop-types'
import React from 'react'

import NewBookmarkButton from '../containers/NewBookmarkButton'
import { connect, Provider, findOne } from '../lib/react-twinql'

const Nav = ({ webId, img }) =>
  <nav className='navbar navbar-toggleable-md navbar-light bg-faded mb-2'>
    <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <a className='navbar-brand' href="./">Mark</a>
    <div className='collapse navbar-collapse'>
      <div className='mr-auto' />
      <form className='form-inline'>
        <NewBookmarkButton />
        <a href={`https://linkeddata.github.io/profile-editor/#/profile/view?webid=${encodeURIComponent(webId)}`}>
          <img
            src={img}
            className='rounded'
            height='30'
            width='30'
            alt='your profile image'
          />
        </a>
      </form>
    </div>
  </nav>

export default connect({
  query: props => `
    @prefix foaf http://xmlns.com/foaf/0.1/

    ${props.webId} {
      foaf.img
    }
  `,

  mapResponseToProps: (response, props) => {
    if (!response) {
      return { webId, img: '/solid-logo.svg' }
    }
    const { webId } = props
    const img = findOne(response, 'foaf:img')
    return { webId, img }
  },

  mapErrorToProps: (error, props) => {
    const { webId } = props
    return { webId, img: '/solid-logo.svg' }
  }
})(Nav)
