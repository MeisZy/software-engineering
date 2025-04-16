import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google'
//replace with the clientId with the actual next time
const clientId = import.meta.env.OAUTH_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <GoogleOAuthProvider clientId={clientId}>
          <App />
      </GoogleOAuthProvider>
    </Router>
  </React.StrictMode>,
)