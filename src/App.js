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
      bookmarks: [
        {
          title: 'JSON-LD',
          url: 'http://json-ld.org/',
          tags: ['JSON-LD', 'Linked Data'],
          comments: 'JSON-LD home page',
          archived: false
        },
        {
          title: 'JSON-LD Framing',
          url: 'http://json-ld.org/spec/latest/json-ld-framing/',
          tags: ['JSON-LD', 'Linked Data', 'spec'],
          comments: 'JSON-LD framing spec',
          archived: true
        }
      ],
      selectedTags: new Immutable.Set()
    }
    this.handleToggleShowArchived = this.handleToggleShowArchived.bind(this)
  }

  getTags () {
    return this.state.bookmarks
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

  handleSelectTag (tag) {
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
          handleSelectTag={tag => () => this.handleSelectTag(tag)}
        />
        <BookmarksList
          showArchived={this.state.showArchived}
          bookmarks={this.state.bookmarks}
          selectedTags={this.state.selectedTags}
        />
      </div>
    )
  }
}
