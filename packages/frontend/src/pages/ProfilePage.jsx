import { useQuery } from '@apollo/client'
import MonkeyList from '@components/MonkeyList'
import userTags from '@constants/tags'
import { GET_USER_QUERY } from '@graphql/user'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProfilePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    user: loggedInUser,
    isAuthenticated: isOnline,
    logout,
  } = useContext(AuthContext)
  const isOwner = loggedInUser?.id === id

  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { id },
  })

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">{error.message}</Typography>
  if (!data?.user) return <Typography>User not found</Typography>

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: 'secondary.main',
          }}
        >
          {data.user.username.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {data.user.username}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: isOnline ? 'green' : 'red',
              }}
            />
            <Typography variant="body1">
              {isOnline ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        {userTags.map((tag) => (
          <Chip
            key={tag.label}
            label={tag.label}
            color={tag.color}
            sx={{ textTransform: 'none' }}
          />
        ))}
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
        }}
      >
        Owned Monkeys
      </Typography>
      <MonkeyList monkeys={data.user.items} isProfilePage={true} />
      {isOwner && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 4, fontSize: '1rem', px: 4 }}
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Logout
        </Button>
      )}
    </Container>
  )
}

export default ProfilePage
