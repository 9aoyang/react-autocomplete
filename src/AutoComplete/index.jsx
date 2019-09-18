import './index.css'

import React from 'react'

class Select extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
  }
  handleClick = (value, index) => {
    this.props.onChange(value)
    this.props.highlight(index)
    if (this.props.onSelect) {
      this.props.onSelect(value)
    }
  }
  onMouseEnter = () => {
    this.setState({
      hover: true
    })
  }
  onMouseLeave = () => {
    this.setState({
      hover: false
    })
  }
  render() {
    const { hover } = this.state
    const { style, dataSource, isShow, currentIndex } = this.props
    if (dataSource && Array.isArray(dataSource)) {
      return (
        <ul
          style={style}
          className={isShow ? 'show' : 'hidden'}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {dataSource.map((item, index) => {
            switch (typeof item) {
              case 'number':
              case 'string':
                return (
                  <li
                    key={item}
                    className={!hover && index === currentIndex ? 'current' : ''}
                    onClick={() => this.handleClick(item, index)}
                  >
                    {item}
                  </li>
                )
              case 'object':
                return (
                  <li
                    key={item.value}
                    className={!hover && index === currentIndex ? 'current' : ''}
                    onClick={() => this.handleClick(item.value, index)}
                  >
                    {item.text}
                  </li>
                )
              default:
                throw new Error(
                  'AutoComplete[dataSource] only supports type `number[] | string[] | Object[]`.'
                )
            }
          })}
        </ul>
      )
    } else {
      return <ul className="no-data"></ul>
    }
  }
}

class AutoComplete extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFocus: false,
      currentIndex: 0
    }
  }

  handleChange = e => {
    this.changeFocus(true)
    const value = e.target.value
    const { onChange, onSearch } = this.props

    if (onChange) {
      onChange(value)
    }

    if (onSearch) {
      onSearch(value)
    }
  }

  changeFocus(boolean) {
    this.setState({
      isFocus: boolean
    })
  }

  handleFocus = e => {
    this.changeFocus(true)
    if (this.props.onSearch) {
      this.props.onSearch(e.target.value)
    }

    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  }

  handleBlur = e => {
    this.changeFocus(false)

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  handleSelect = value => {
    this.changeFocus(false)
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handleKeyDown = e => {
    const { currentIndex, isFocus } = this.state

    if (isFocus) {
      const code = e.keyCode

      switch (code) {
        // enter
        case 13:
          this.handleEnter(currentIndex)
          break
        // up
        case 38:
          this.highlight(currentIndex - 1)
          break
        // down
        case 40:
          this.highlight(currentIndex + 1)
          break
        default:
          break
      }
    }
  }

  handleEnter = index => {
    if (this.state.isFocus && index >= 0 && index <= this.props.dataSource.length) {
      this.handleSelect(this.props.dataSource[index])
    }
  }

  highlight = index => {
    if (index < 0) {
      index = 0
    }
    if (index >= this.props.dataSource.length) {
      index = this.props.dataSource.length - 1
    }

    this.setState({
      currentIndex: index
    })
  }
  render() {
    const { currentIndex, isFocus } = this.state
    const { value, style, dataSource } = this.props
    const isShow = Array.isArray(dataSource) && dataSource.length > 0 && isFocus
    return (
      <div>
        <input
          value={value}
          style={style}
          type="text"
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
        />
        <Select
          {...this.props}
          isShow={isShow}
          currentIndex={currentIndex}
          highlight={this.highlight}
        />
      </div>
    )
  }
}

export default AutoComplete
