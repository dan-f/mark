import React from 'react'

import SignupButton from './SignupButton'

export default function LoginPage ({ loginUiOpen, loginServer, onChangeLoginServer, onClickLogin, onClickCancel, onSubmitLogin, loginAndShowBookmarks }) {
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
            <form className='form-inline' onSubmit={onSubmitLogin}>
              <div className='form-group'>
                <label className='sr-only' htmlFor='webid-input'>WebID or the site where you log in</label>
                <input id='webid-input' type='text' value={loginServer} onChange={onChangeLoginServer} placeholder='What is your WebID?' className='form-control mr-2' />
                <button type='submit' className='btn btn-primary mr-1'>Log In</button>
                <button type='button' className='btn btn-secondary' onClick={onClickCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )
        : (
          <div>
            <button type='button' className='btn btn-outline-primary' onClick={onClickLogin}>Log In</button>
            <SignupButton onSignupSuccess={loginAndShowBookmarks} />
          </div>
        )
      }
    </div>
  )
}
