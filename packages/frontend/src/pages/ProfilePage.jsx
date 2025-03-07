import { useQuery } from '@apollo/client'
import LinkCrossmarkButton from '@components/LinkCrossmarkButton'
import MonkeyList from '@components/MonkeyList'
import userTags from '@constants/tags'
import { useCrossmark } from '@context/CrossmarkContext'
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

  const { unlinkWallet } = useCrossmark()
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
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          alignItems: 'flex-start',
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/')}
          sx={{
            fontSize: { xs: '0.8rem', md: '1rem' },
            padding: { xs: '6px 12px', md: '8px 16px' },
          }}
        >
          Home
        </Button>

        <LinkCrossmarkButton />
      </Box>
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
            unlinkWallet()
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
