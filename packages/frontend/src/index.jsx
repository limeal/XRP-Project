import { ApolloProvider } from '@apollo/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { client } from './apolloClient'
import App from './App'
import AuthProvider from './context/AuthProvider'
import CrossmarkProvider from './context/CrossmarkProvider'
import GlobalStyles from './GlobalStyles'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <CrossmarkProvider>
          <GlobalStyles />
          <App />
        </CrossmarkProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
)

reportWebVitals()
