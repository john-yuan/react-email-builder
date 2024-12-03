import './index.less'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const root = document.getElementById('root') as HTMLElement

const element = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

if (root.childElementCount) {
  ReactDOM.hydrateRoot(root, element)
} else {
  ReactDOM.createRoot(root).render(element)
}
