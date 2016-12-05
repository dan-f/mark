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
  }

  getTags () {
    return this.props.bookmarks
      .map(bookmark => bookmark.model)
      .map(bookmark => bookmark.get('tags'))
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
      this.props.addFilterTag(tag)
    }
  }

  handleRemoveTag (tag) {
    return (event) => {
      if (event.type === 'click' || event.key === ' ') {
        this.props.removeFilterTag(tag)
      }
    }
  }

  handleTagFilterInput (event) {
    this.setState({tagFilterInput: event.target.value})
  }

  getMatchingTags () {
    return this.getTags().filter(tag =>
      !this.props.selectedTags.has(tag) &&
      tag.toLowerCase().startsWith(this.state.tagFilterInput.toLowerCase())
    )
  }

  render () {
    return (
      <BookmarksFilterControls
        selectedTags={this.props.selectedTags}
        tagFilterInput={this.state.tagFilterInput}
        matchingTags={this.getMatchingTags()}
        handleSelectTag={this.handleSelectTag}
        handleRemoveTag={this.handleRemoveTag}
        handleTagFilterInput={this.handleTagFilterInput}
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    bookmarks: state.bookmarks,
    selectedTags: state.filters.selectedTags
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(BookmarkActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksFilter)
