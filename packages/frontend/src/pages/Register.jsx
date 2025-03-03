import { useMutation } from '@apollo/client'
import { SIGNUP_MUTATION } from '@graphql/auth'
import { Button, Container, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login: authLogin } = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [signupMutation, { loading, error }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.signup
      authLogin(token, user)
      navigate('/profile')
    },
  })

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    signupMutation({ variables: { username, email, password } })
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
        Register
      </Typography>
      {error && <Typography color="error">{error.message}</Typography>}

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2, maxWidth: '400px' }}
      />

      <TextField
        label="Email"
        type="email"
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

      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{ mb: 2, maxWidth: '400px' }}
      />

      <Button
        variant="contained"
        disabled={loading}
        color="secondary"
        onClick={handleRegister}
        sx={{ width: '100%', maxWidth: '400px', mb: 2 }}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>

      <Typography variant="body2">
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
          Login here
        </Link>
      </Typography>
    </Container>
  )
}

export default RegisterPage
