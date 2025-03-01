import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    secondary: {
      main: 'rgb(48, 60, 67)',
    },
    neutral: {
      main: 'rgb(217, 217, 217)',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
  },
})

export default theme
