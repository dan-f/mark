import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as Actions from '../actions'

class DropContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.state = { dragging: false }
  }

  onDragOver (event) {
    event.preventDefault()
  }

  onDragEnter (event) {
    this.setState({ dragging: true })
  }

  onDrop (event) {
    event.preventDefault()
    const { dataTransfer } = event
    const uriType = 'text/uri-list'
    if (!dataTransfer.types.includes(uriType)) {
      return
    }
    this.setState({ dragging: false })
    this.createBookmark(dataTransfer.getData(uriType))
  }

  onDragLeave (event) {
    if (event.target !== this.dropOverlay) {
      return
    }
    this.setState({ dragging: false })
  }

  onDragEnd (event) {
    this.setState({ dragging: false })
  }

  createBookmark (link) {
    const { createAndEditNew, edit } = this.props.actions
    const { bookmark } = createAndEditNew()
    const updatedBookmark = bookmark.setAny('url', link, { namedNode: true })
    edit(updatedBookmark)
  }

  render () {
    const { children, loggedIn } = this.props
    const { dragging } = this.state
    const { onDragOver, onDragEnter, onDragLeave, onDragEnd, onDrop } = this
    if (!loggedIn) {
      return (
        <div>
          {children}
        </div>
      )
    }
    return (
      <div
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
      >
        <div
          className={'drop-overlay' + (dragging ? ' active' : '')}
          ref={el => { this.dropOverlay = el }}
        >
          {dragging
            ? <div className='drop-copy'>Drop a link to create a new bookmark</div>
            : <div />
          }
        </div>
        {children}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: !!state.profile
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DropContainer)
