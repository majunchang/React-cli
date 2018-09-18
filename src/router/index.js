/*
   Root, Router 配置
*/
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import HelloWorld from '../page/HelloWorld'

const App = () => (
  <div>
    <Switch>
      <Route path='/' exact component={HelloWorld} />
    </Switch>
  </div>
)

export default hot(module)(App)
