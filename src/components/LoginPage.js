import React from 'react'

import SignupButton from '../containers/SignupButton'

export default function LoginPage ({ loginUiOpen, handleClickLogin, loginServer, handleChangeLoginServer, handleCancel, handleSubmit }) {
  return (
    <div>
      <p>
        Mark stores and indexes your bookmarks on the web.
      </p>
      <p>
        It runs on <a href='https://solid.mit.edu/' target='_blank'>Solid</a>, an architecture where you own your data.
      </p>
      {loginUiOpen
        ? (
          <div>
            <form className='form-inline' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label className='sr-only' htmlFor='webid-input'>WebID or the site where you log in</label>
                <input id='webid-input' type='text' value={loginServer} onChange={handleChangeLoginServer} placeholder='Where do you log in?' className='form-control m-r-1' />
                <button type='submit' className='btn btn-primary'>Log In</button>
                <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )
        : (
          <div>
            <button type='button' className='btn btn-outline-primary' onClick={handleClickLogin}>Log In</button>
            <SignupButton />
          </div>
        )
      }
    </div>
  )
}
