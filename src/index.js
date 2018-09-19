
// const publicPath = assetsPublicPath
// assetsPublicPath 在 /config/index.js 中配置，由 imports-loader 注入

import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
import {BrowserRouter} from 'react-router-dom'

// import store from './store/index'
import App from './router/index'

const mountNode = document.getElementById('app')

/*
   react-redux 提供 Provider 组件，
   被 Provider 组件包裹的整个 APP 中的每个组件，都可以通过 connect 去连接 store
*/
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  mountNode
)
