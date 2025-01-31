import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google'
//replace with the clientId with the actual next time
const clientId = '1089046623140-90lfs8bvp1o2q4slgg8u8tpeumcshtua.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </Router>
  </React.StrictMode>,
)