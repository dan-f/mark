import React from 'react'

export default class BookmarksLoader extends React.Component {
  render () {
    const {bookmarksUrl} = this.props.params
    return (
      <div>
        {bookmarksUrl}
      </div>
    )
  }
}
