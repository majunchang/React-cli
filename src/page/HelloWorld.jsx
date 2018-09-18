import React from 'react'

export default class HelloWorld extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: 'world'
    }
  }

  render () {
    let {name} = this.state
    return (
      <div>
        <h3>Hello, {name}</h3>
      </div>
    )
  }
}
