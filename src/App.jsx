import { CssBaseline, ThemeProvider } from '@mui/material'
import AppRoutes from '@routes/index'
import { BrowserRouter as Router } from 'react-router-dom'
import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  )
}

export default App
