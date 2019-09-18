import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import AutoComplete from './AutoComplete'
import * as serviceWorker from './serviceWorker'

function onSelect(value) {
  console.log('onSelect', value)
}

class Complete extends React.Component {
  state = {
    value: 'abc',
    dataSource: []
  }

  onSearch = searchText => {
    this.setState({
      dataSource: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)]
    })
  }

  onChange = value => {
    this.setState({ value })
  }

  render() {
    const { dataSource, value } = this.state
    return (
      <div>
        <AutoComplete
          value={value}
          dataSource={dataSource}
          style={{ width: 200 }}
          onSelect={onSelect}
          onChange={this.onChange}
          onSearch={this.onSearch}
          placeholder="input here"
        />
      </div>
    )
  }
}

ReactDOM.render(<Complete />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
