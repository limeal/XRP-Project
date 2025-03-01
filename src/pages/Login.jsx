import { Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    console.log('Logging in with:', { username, password })
    // TODO: Implement authentication logic
  }

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 30,
          left: 30,
          fontSize: { xs: '0.8rem', md: '1rem' },
          padding: { xs: '6px 12px', md: '8px 16px' },
          zIndex: 10,
        }}
      >
        Home
      </Button>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Login
      </Typography>

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2, maxWidth: '400px' }}
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2, maxWidth: '400px' }}
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogin}
        sx={{ width: '100%', maxWidth: '400px', mb: 2 }}
      >
        Login
      </Button>

      <Typography variant="body2">
        Don&#39;t have an account?{' '}
        <Link
          to="/register"
          style={{ color: '#1976d2', textDecoration: 'none' }}
        >
          Register here
        </Link>
      </Typography>
    </Container>
  )
}

export default Login
