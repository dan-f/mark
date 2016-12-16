import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

export function BookmarksWelcome ({ personalBookmarksUrl }) {
  return (
    <div className='row'>
      <div className='col-xs-12'>
        <Link to={personalBookmarksUrl}>View your bookmarks</Link>
      </div>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    personalBookmarksUrl: `/bookmarks/${encodeURIComponent(state.bookmarksUrl)}`
  }
}

export default connect(mapStateToProps)(BookmarksWelcome)
