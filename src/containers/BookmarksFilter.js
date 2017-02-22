import * as Immutable from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as BookmarkActions from '../actions'
import BookmarksFilterControls from '../components/BookmarksFilterControls'

export class BookmarksFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {tagFilterInput: ''}
    this.handleTagFilterInput = this.handleTagFilterInput.bind(this)
    this.getMatchingTags = this.getMatchingTags.bind(this)
    this.handleSelectTag = this.handleSelectTag.bind(this)
    this.handleRemoveTag = this.handleRemoveTag.bind(this)
    this.handleShowArchived = this.handleShowArchived.bind(this)
  }

  getTags () {
    return this.props.bookmarks
      .map(bookmark => bookmark.get('model'))
      .map(model => model.get('tags'))
      .reduce((allTags, curTags) => {
        return [...allTags, ...curTags]
      }, [])
      .reduce((tagSet, tag) => {
        return tagSet.add(tag)
      }, new Immutable.Set())
  }

  handleSelectTag (tag) {
    return () => {
      this.setState({tagFilterInput: ''})
      this.props.actions.addFilterTag(tag)
    }
  }

  handleRemoveTag (tag) {
    return (event) => {
      if (event.type === 'click' || event.key === ' ') {
        this.props.actions.removeFilterTag(tag)
      }
    }
  }

  handleTagFilterInput (event) {
    this.setState({tagFilterInput: event.target.value})
  }

  handleShowArchived (event) {
    this.props.actions.showArchived(event.target.checked)
  }

  getMatchingTags () {
    return this.getTags().filter(tag =>
      !this.props.selectedTags.has(tag) &&
      tag.toLowerCase().startsWith(this.state.tagFilterInput.toLowerCase())
    )
  }

  render () {
    const {showArchived} = this.props
    return (
      <BookmarksFilterControls
        selectedTags={this.props.selectedTags}
        tagFilterInput={this.state.tagFilterInput}
        matchingTags={this.getMatchingTags()}
        showArchived={showArchived}
        handleSelectTag={this.handleSelectTag}
        handleRemoveTag={this.handleRemoveTag}
        handleTagFilterInput={this.handleTagFilterInput}
        handleShowArchived={this.handleShowArchived}
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    bookmarks: state.bookmarks,
    selectedTags: state.filters.selectedTags,
    showArchived: state.filters.showArchived
  }
}

function mapDispatchToProps (dispatch) {
  return {actions: bindActionCreators(BookmarkActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksFilter)
