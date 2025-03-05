import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '@graphql/auth'
import { Button, Container, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login: authLogin } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.login
      authLogin(token, user)
      navigate(`/profile/${user.id}`)
    },
  })

  const handleLogin = () => {
    loginMutation({ variables: { email, password } })
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
      {error && <Typography color="error">{error.message}</Typography>}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        disabled={loading}
        onClick={handleLogin}
        sx={{ width: '100%', maxWidth: '400px', mb: 2 }}
      >
        {loading ? 'Logging in...' : 'Login'}
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
