import * as Immutable from 'immutable'
import React from 'react'

import BookmarksFilter from './components/BookmarksFilter'
import BookmarkForm from './components/BookmarkForm'
import BookmarksList from './components/BookmarksList'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showArchived: false,
      selectedTags: new Immutable.Set()
    }
    this.handleToggleShowArchived = this.handleToggleShowArchived.bind(this)
    this.addSelectedTag = this.addSelectedTag.bind(this)
  }

  getTags () {
    return this.props.bookmarks
      .map(bookmark => bookmark.tags)
      .reduce((allTags, curTags) => {
        return [...allTags, ...curTags]
      }, [])
      .reduce((tagSet, tag) => {
        return tagSet.add(tag)
      }, new Immutable.Set())
  }

  handleToggleShowArchived () {
    this.setState({showArchived: !this.state.showArchived})
  }

  addSelectedTag (tag) {
    this.setState({selectedTags: this.state.selectedTags.add(tag)})
  }

  render () {
    return (
      <div>
        <BookmarkForm />
        <BookmarksFilter
          showArchived={this.state.showArchived}
          handleToggleShowArchived={this.handleToggleShowArchived}
          tags={this.getTags()}
          selectedTags={this.state.selectedTags}
          addSelectedTag={this.addSelectedTag}
        />
        <BookmarksList
          showArchived={this.state.showArchived}
          bookmarks={this.props.bookmarks}
          selectedTags={this.state.selectedTags}
        />
      </div>
    )
  }
}
