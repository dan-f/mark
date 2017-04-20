import React from 'react'

import LoginSignup from '../containers/LoginSignup'

export default function WelcomePage ({ location }) {
  return (
    <div>
      <p>
        Mark stores and indexes your bookmarks on the web.
      </p>
      <p>
        It runs on <a href='https://solid.mit.edu/' target='_blank'>Solid</a>, an architecture where you own your data.
      </p>
      <LoginSignup />
    </div>
  )
}
