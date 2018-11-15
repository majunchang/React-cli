import React from 'react'

export default class HelloWorld extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: 'world!'
    }
  }

  render () {
    let { name } = this.state
    const style = { 'textAlign': 'center', 'marginTop': '100px' }
    return (
      <div>
        <div style={style}>
          <img src='../../static/img/logo.png' alt='' />
          <img src='/static/img/logo.png' alt='' />
          <h3>Hello, {name}</h3>
        </div>
      </div>
    )
  }
}
