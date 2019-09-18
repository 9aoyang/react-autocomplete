import { mount } from 'enzyme'
import React from 'react'

import AutoComplete from '.'

describe(`mount and unmount`, () => {
  it(`component could be updated and unmounted without errors`, () => {
    const wrapper = mount(<AutoComplete />)
    expect(() => {
      wrapper.setProps({})
      wrapper.unmount()
    }).not.toThrow()
  })

  it('AutoComplete should work when dataSource is object array', () => {
    const wrapper = mount(
      <AutoComplete dataSource={[{ text: '1', value: 1 }, { text: '2', value: 2 }]}></AutoComplete>
    )
    expect(wrapper.find('input').length).toBe(1)
    wrapper.find('input').simulate('change', { target: { value: '1' } })
    expect(wrapper.find('li').length).toBe(2)
  })

  it('AutoComplete should work when dataSource is number array', () => {
    const wrapper = mount(<AutoComplete dataSource={[1, 2, 3]}></AutoComplete>)
    expect(wrapper.find('input').length).toBe(1)
    wrapper.find('input').simulate('change', { target: { value: '1' } })
    expect(wrapper.find('li').length).toBe(3)
  })

  it('AutoComplete should work when dataSource is string array', () => {
    const wrapper = mount(<AutoComplete dataSource={['a', 'b', 'c']}></AutoComplete>)
    expect(wrapper.find('input').length).toBe(1)
    wrapper.find('input').simulate('change', { target: { value: '1' } })
    expect(wrapper.find('li').length).toBe(3)
  })

  it('AutoComplete throws error when contains invalid dataSource', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => {
      mount(
        <AutoComplete dataSource={[() => {}]}>
          <textarea />
        </AutoComplete>
      )
    }).toThrow()
    console.error.mockRestore()
  })
})

describe('event callback function', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  let container
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('onChange()', () => {
    const handleChange = jest.fn()
    const wrapper = mount(<AutoComplete onChange={handleChange} dataSource={['a', 'b', 'c']} />)
    wrapper.find('input').simulate('change', { target: { value: '1' } })
    expect(handleChange).toHaveBeenCalled()

    wrapper.find('input').simulate('keydown', { keyCode: 13 })
    expect(handleChange).toHaveBeenCalled()

    wrapper.find('.current').simulate('click')
    expect(handleChange).toHaveBeenCalled()
  })

  it('onSearch()', () => {
    const handleSearch = jest.fn()
    const wrapper = mount(<AutoComplete onSearch={handleSearch} />)
    wrapper.find('input').simulate('change', { target: { value: '' } })
    expect(handleSearch).toHaveBeenCalled()
  })

  it('onFocus()', () => {
    const handleFocus = jest.fn()
    const wrapper = mount(<AutoComplete onFocus={handleFocus} />, { attachTo: container })
    wrapper
      .find('input')
      .instance()
      .focus()
    jest.runAllTimers()
    expect(handleFocus).toHaveBeenCalled()
  })

  it('onBlur()', () => {
    const handleBlur = jest.fn()
    const wrapper = mount(<AutoComplete onBlur={handleBlur} />, { attachTo: container })
    wrapper
      .find('input')
      .instance()
      .focus()
    jest.runAllTimers()
    wrapper
      .find('input')
      .instance()
      .blur()
    jest.runAllTimers()
    expect(handleBlur).toHaveBeenCalled()
  })

  it('onKeyDown', () => {
    const wrapper = mount(<AutoComplete dataSource={['a', 'b', 'c']} />)

    /** keyCode 13 is Enter */
    wrapper.setState({
      isFocus: true
    })
    wrapper.find('input').simulate('keydown', { keyCode: 13 })
    expect(wrapper.state('isFocus')).toBe(false)

    /** keyCode 38 is Up */
    wrapper.setState({
      isFocus: true,
      currentIndex: 1
    })
    wrapper.find('input').simulate('keydown', { keyCode: 38 })
    expect(wrapper.state('currentIndex')).toBe(0)
    wrapper.setState({
      isFocus: true,
      currentIndex: 0
    })
    wrapper.find('input').simulate('keydown', { keyCode: 38 })
    expect(wrapper.state('currentIndex')).toBe(0)

    /** keyCode 40 is Down */
    wrapper.setState({
      isFocus: true,
      currentIndex: 1
    })
    wrapper.find('input').simulate('keydown', { keyCode: 40 })
    expect(wrapper.state('currentIndex')).toBe(2)

    wrapper.setState({
      isFocus: true,
      currentIndex: 2
    })
    wrapper.find('input').simulate('keydown', { keyCode: 40 })
    expect(wrapper.state('currentIndex')).toBe(2)

    /** keyCode 100 is d */
    wrapper.setState({
      isFocus: true,
      currentIndex: 1
    })
    wrapper.find('input').simulate('keydown', { keyCode: 100 })
    expect(wrapper.state('isFocus')).toBe(true)
    expect(wrapper.state('currentIndex')).toBe(1)
  })
})
