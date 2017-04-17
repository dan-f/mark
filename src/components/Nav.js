import React from 'react'

import NewBookmarkButton from '../containers/NewBookmarkButton'

export default ({ webId, 'foaf:img': img }) =>
  <nav className='navbar navbar-toggleable-md navbar-light bg-faded mb-2'>
    <button className='navbar-toggler navbar-toggler-right' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
      <span className='navbar-toggler-icon' />
    </button>
    <a className='navbar-brand' href='./'>Mark</a>
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
