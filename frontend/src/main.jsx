import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import './css/style.css'

import AuthProvider from './store/AuthProvider/AuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import SocketProvider from './store/AuthProvider/SocketProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
    <App />
      </SocketProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
