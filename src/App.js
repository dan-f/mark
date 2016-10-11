import React from 'react'

import BookmarksFilter from './components/BookmarksFilter'
import BookmarkForm from './components/BookmarkForm'
import BookmarksList from './components/BookmarksList'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {showArchived: false}
  }

  handleToggleShowArchived () {
    this.setState({showArchived: !this.state.showArchived})
  }

  render () {
    return (
      <div>
        <BookmarkForm />
        <BookmarksFilter showArchived={this.state.showArchived} handleToggleShowArchived={this.handleToggleShowArchived.bind(this)} />
        <BookmarksList
          showArchived={this.state.showArchived}
          bookmarks={[
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
          ]}
        />
      </div>
    )
  }
}
